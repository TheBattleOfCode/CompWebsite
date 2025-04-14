package com.comp.web.controller;

import com.comp.web.model.dto.request.CreateProblemRequest;
import com.comp.web.model.dto.request.SubmitProblemRequest;
import com.comp.web.model.dto.response.ProblemResponse;
import com.comp.web.model.dto.response.ProblemSubmissionResponse;
import com.comp.web.model.dto.response.SubmissionResultResponse;
import com.comp.web.model.entity.EProblemType;
import com.comp.web.service.ProblemService;
import com.comp.web.service.ProblemSubmissionService;
import com.comp.web.service.TestAuthentication;
import com.comp.web.service.impl.UserDetailsImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.quality.Strictness;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class ProblemControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ProblemService problemService;

    @Mock
    private ProblemSubmissionService problemSubmissionService;

    @InjectMocks
    private ProblemController problemController;

    private ObjectMapper objectMapper;
    private ProblemResponse problemResponse;
    private CreateProblemRequest createProblemRequest;
    private SubmitProblemRequest submitProblemRequest;
    private ProblemSubmissionResponse submissionResponse;
    private SubmissionResultResponse submissionResultResponse;
    private Authentication authentication;
    private UserDetailsImpl userDetails;

    @BeforeEach
    void setUp() {
        // Configure ObjectMapper to handle LocalDateTime
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        // Create a custom HttpMessageConverter for handling Page objects
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        converter.setObjectMapper(objectMapper);

        mockMvc = MockMvcBuilders
                .standaloneSetup(problemController)
                .setControllerAdvice(new com.comp.web.exception.ControllerExceptionHandler())
                .setMessageConverters(converter)
                .build();

        userDetails = new UserDetailsImpl(1L, "testuser", "test@example.com", "password",
                List.of(new SimpleGrantedAuthority("ROLE_USER")));

        // Create test data with fixed dates instead of LocalDateTime.now()
        LocalDateTime fixedTime = LocalDateTime.of(2025, 4, 13, 10, 0, 0);

        problemResponse = ProblemResponse.builder()
                .id(1L)
                .title("Test Problem")
                .description("This is a test problem")
                .type(EProblemType.NUMBER_GEN)
                .sampleInput("10")
                .sampleOutput("20")
                .difficultyLevel(5)
                .maxScore(100)
                .createdAt(fixedTime)
                .updatedAt(fixedTime)
                .createdByUsername("testuser")
                .build();

        createProblemRequest = new CreateProblemRequest();
        createProblemRequest.setTitle("Test Problem");
        createProblemRequest.setDescription("This is a test problem");
        createProblemRequest.setType(EProblemType.NUMBER_GEN);
        createProblemRequest.setInputGeneratorCode("Math.floor(Math.random() * 100)");
        createProblemRequest.setOutputGeneratorCode("parseInt(input) * 2");
        createProblemRequest.setSampleInput("10");
        createProblemRequest.setSampleOutput("20");
        createProblemRequest.setDifficultyLevel(5);
        createProblemRequest.setMaxScore(100);

        submitProblemRequest = new SubmitProblemRequest();
        submitProblemRequest.setProblemId(1L);
        submitProblemRequest.setAnswer("20");

        submissionResponse = ProblemSubmissionResponse.builder()
                .id(1L)
                .problemId(1L)
                .problemTitle("Test Problem")
                .username("testuser")
                .submittedAnswer("20")
                .isCorrect(true)
                .score(100)
                .submittedAt(fixedTime)
                .build();

        submissionResultResponse = SubmissionResultResponse.builder()
                .submissionId(1L)
                .isCorrect(true)
                .score(100)
                .message("Correct answer!")
                .build();

        // Setup SecurityContext for all tests
        lenient().when(problemService.getAllProblems(any())).thenReturn(new PageImpl<>(List.of(problemResponse)));
        lenient().when(problemService.getProblemById(anyLong())).thenReturn(problemResponse);
        lenient().when(problemService.getProblemsByType(any(), any())).thenReturn(new PageImpl<>(List.of(problemResponse)));
        lenient().when(problemService.getProblemsByDifficultyLevel(anyInt(), any())).thenReturn(new PageImpl<>(List.of(problemResponse)));
        lenient().when(problemService.createProblem(any(), anyLong())).thenReturn(problemResponse);
        lenient().when(problemService.updateProblem(anyLong(), any())).thenReturn(problemResponse);
        lenient().when(problemService.generateProblemInput(anyLong())).thenReturn("10");
        lenient().doNothing().when(problemService).deleteProblem(anyLong());

        lenient().when(problemSubmissionService.submitProblem(any(), anyLong())).thenReturn(submissionResultResponse);
        lenient().when(problemSubmissionService.getSubmissionsByUser(anyLong(), any())).thenReturn(new PageImpl<>(List.of(submissionResponse)));
        lenient().when(problemSubmissionService.getBestSubmissionByUserAndProblem(anyLong(), anyLong())).thenReturn(submissionResponse);
        lenient().when(problemSubmissionService.countSolvedProblemsByUser(anyLong())).thenReturn(5L);
        lenient().when(problemSubmissionService.getTotalScoreByUser(anyLong())).thenReturn(500);

        // Setup SecurityContext
        authentication = new TestAuthentication(userDetails, userDetails.getAuthorities());
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void getAllProblems_Success() throws Exception {
        mockMvc.perform(get("/problems")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].title").value("Test Problem"))
                .andExpect(jsonPath("$.content[0].type").value("NUMBER_GEN"));

        verify(problemService).getAllProblems(any(Pageable.class));
    }

    @Test
    void getProblemById_Success() throws Exception {
        mockMvc.perform(get("/problems/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Test Problem"))
                .andExpect(jsonPath("$.type").value("NUMBER_GEN"));

        verify(problemService).getProblemById(1L);
    }

    @Test
    void getProblemsByType_Success() throws Exception {
        mockMvc.perform(get("/problems/type/NUMBER_GEN")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].title").value("Test Problem"))
                .andExpect(jsonPath("$.content[0].type").value("NUMBER_GEN"));

        verify(problemService).getProblemsByType(eq(EProblemType.NUMBER_GEN), any(Pageable.class));
    }

    @Test
    void getProblemsByDifficultyLevel_Success() throws Exception {
        mockMvc.perform(get("/problems/difficulty/5")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].title").value("Test Problem"))
                .andExpect(jsonPath("$.content[0].difficultyLevel").value(5));

        verify(problemService).getProblemsByDifficultyLevel(eq(5), any(Pageable.class));
    }

    @Test
    void createProblem_Success() throws Exception {
        mockMvc.perform(post("/problems")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createProblemRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Test Problem"))
                .andExpect(jsonPath("$.type").value("NUMBER_GEN"));

        verify(problemService).createProblem(any(CreateProblemRequest.class), eq(1L));
    }

    @Test
    void updateProblem_Success() throws Exception {
        mockMvc.perform(put("/problems/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createProblemRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Test Problem"))
                .andExpect(jsonPath("$.type").value("NUMBER_GEN"));

        verify(problemService).updateProblem(eq(1L), any(CreateProblemRequest.class));
    }

    @Test
    void deleteProblem_Success() throws Exception {
        mockMvc.perform(delete("/problems/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        verify(problemService).deleteProblem(1L);
    }

    @Test
    void submitProblem_Success() throws Exception {
        mockMvc.perform(post("/problems/submit")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(submitProblemRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.submissionId").value(1))
                .andExpect(jsonPath("$.isCorrect").value(true))
                .andExpect(jsonPath("$.score").value(100))
                .andExpect(jsonPath("$.message").value("Correct answer!"));

        verify(problemSubmissionService).submitProblem(any(SubmitProblemRequest.class), eq(1L));
    }

    @Test
    void getUserSubmissions_Success() throws Exception {
        mockMvc.perform(get("/problems/submissions")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].problemId").value(1))
                .andExpect(jsonPath("$.content[0].problemTitle").value("Test Problem"))
                .andExpect(jsonPath("$.content[0].username").value("testuser"))
                .andExpect(jsonPath("$.content[0].isCorrect").value(true))
                .andExpect(jsonPath("$.content[0].score").value(100));

        verify(problemSubmissionService).getSubmissionsByUser(eq(1L), any(Pageable.class));
    }

    @Test
    void getBestSubmissionForProblem_Success() throws Exception {
        mockMvc.perform(get("/problems/submissions/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.problemId").value(1))
                .andExpect(jsonPath("$.problemTitle").value("Test Problem"))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.isCorrect").value(true))
                .andExpect(jsonPath("$.score").value(100));

        verify(problemSubmissionService).getBestSubmissionByUserAndProblem(1L, 1L);
    }

    @Test
    void getSolvedProblemsCount_Success() throws Exception {
        mockMvc.perform(get("/problems/stats/solved")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("5"));

        verify(problemSubmissionService).countSolvedProblemsByUser(1L);
    }

    @Test
    void getTotalScore_Success() throws Exception {
        mockMvc.perform(get("/problems/stats/score")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("500"));

        verify(problemSubmissionService).getTotalScoreByUser(1L);
    }

    @Test
    void generateProblemInput_Success() throws Exception {
        mockMvc.perform(get("/problems/1/generate-input")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("10"));

        verify(problemService).generateProblemInput(1L);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }
}
