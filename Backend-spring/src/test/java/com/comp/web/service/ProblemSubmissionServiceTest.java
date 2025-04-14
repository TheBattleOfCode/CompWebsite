package com.comp.web.service;

import com.comp.web.exception.ResourceNotFoundException;
import com.comp.web.model.dto.request.SubmitProblemRequest;
import com.comp.web.model.dto.response.ProblemSubmissionResponse;
import com.comp.web.model.dto.response.SubmissionResultResponse;
import com.comp.web.model.entity.EProblemType;
import com.comp.web.model.entity.Problem;
import com.comp.web.model.entity.ProblemSubmission;
import com.comp.web.model.entity.User;
import com.comp.web.repository.ProblemRepository;
import com.comp.web.repository.ProblemSubmissionRepository;
import com.comp.web.repository.UserRepository;
import com.comp.web.service.impl.ProblemSubmissionServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProblemSubmissionServiceTest {

    @Mock
    private ProblemSubmissionRepository problemSubmissionRepository;

    @Mock
    private ProblemRepository problemRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProblemService problemService;

    @InjectMocks
    private ProblemSubmissionServiceImpl problemSubmissionService;

    private User user;
    private Problem problem;
    private ProblemSubmission submission;
    private SubmitProblemRequest submitProblemRequest;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPassword("password");

        problem = new Problem();
        problem.setId(1L);
        problem.setTitle("Test Problem");
        problem.setDescription("This is a test problem");
        problem.setType(EProblemType.NUMBER_GEN);
        problem.setInputGeneratorCode("Math.floor(Math.random() * 100)");
        problem.setOutputGeneratorCode("parseInt(input) * 2");
        problem.setSampleInput("10");
        problem.setSampleOutput("20");
        problem.setDifficultyLevel(5);
        problem.setMaxScore(100);
        problem.setCreatedBy(user);
        problem.setCreatedAt(LocalDateTime.now());
        problem.setUpdatedAt(LocalDateTime.now());

        submission = new ProblemSubmission();
        submission.setId(1L);
        submission.setProblem(problem);
        submission.setUser(user);
        submission.setSubmittedAnswer("20");
        submission.setIsCorrect(true);
        submission.setScore(100);
        submission.setSubmittedAt(LocalDateTime.now());

        submitProblemRequest = new SubmitProblemRequest();
        submitProblemRequest.setProblemId(1L);
        submitProblemRequest.setAnswer("20");
    }

    @Test
    void submitProblem_CorrectAnswer() {
        when(problemRepository.findById(1L)).thenReturn(Optional.of(problem));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(problemService.generateProblemInput(1L)).thenReturn("10");
        when(problemService.generateProblemOutput(1L, "10")).thenReturn("20");
        when(problemSubmissionRepository.save(any(ProblemSubmission.class))).thenReturn(submission);

        SubmissionResultResponse response = problemSubmissionService.submitProblem(submitProblemRequest, 1L);

        assertNotNull(response);
        assertEquals(1L, response.getSubmissionId());
        assertTrue(response.getIsCorrect());
        assertEquals(100, response.getScore());
        assertEquals("Correct answer!", response.getMessage());

        verify(problemRepository).findById(1L);
        verify(userRepository).findById(1L);
        verify(problemService).generateProblemInput(1L);
        verify(problemService).generateProblemOutput(1L, "10");
        verify(problemSubmissionRepository).save(any(ProblemSubmission.class));
    }

    @Test
    void submitProblem_IncorrectAnswer() {
        when(problemRepository.findById(1L)).thenReturn(Optional.of(problem));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(problemService.generateProblemInput(1L)).thenReturn("10");
        when(problemService.generateProblemOutput(1L, "10")).thenReturn("20");

        submitProblemRequest.setAnswer("30"); // Incorrect answer

        ProblemSubmission incorrectSubmission = new ProblemSubmission();
        incorrectSubmission.setId(1L);
        incorrectSubmission.setProblem(problem);
        incorrectSubmission.setUser(user);
        incorrectSubmission.setSubmittedAnswer("30");
        incorrectSubmission.setIsCorrect(false);
        incorrectSubmission.setScore(0);
        incorrectSubmission.setSubmittedAt(LocalDateTime.now());

        when(problemSubmissionRepository.save(any(ProblemSubmission.class))).thenReturn(incorrectSubmission);

        SubmissionResultResponse response = problemSubmissionService.submitProblem(submitProblemRequest, 1L);

        assertNotNull(response);
        assertEquals(1L, response.getSubmissionId());
        assertFalse(response.getIsCorrect());
        assertEquals(0, response.getScore());
        assertEquals("Incorrect answer. Try again.", response.getMessage());

        verify(problemRepository).findById(1L);
        verify(userRepository).findById(1L);
        verify(problemService).generateProblemInput(1L);
        verify(problemService).generateProblemOutput(1L, "10");
        verify(problemSubmissionRepository).save(any(ProblemSubmission.class));
    }

    @Test
    void submitProblem_ProblemNotFound() {
        when(problemRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            problemSubmissionService.submitProblem(submitProblemRequest, 1L);
        });

        verify(problemRepository).findById(1L);
        verify(userRepository, never()).findById(any());
        verify(problemService, never()).generateProblemInput(any());
        verify(problemService, never()).generateProblemOutput(any(), any());
        verify(problemSubmissionRepository, never()).save(any());
    }

    @Test
    void submitProblem_UserNotFound() {
        when(problemRepository.findById(1L)).thenReturn(Optional.of(problem));
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            problemSubmissionService.submitProblem(submitProblemRequest, 1L);
        });

        verify(problemRepository).findById(1L);
        verify(userRepository).findById(1L);
        verify(problemService, never()).generateProblemInput(any());
        verify(problemService, never()).generateProblemOutput(any(), any());
        verify(problemSubmissionRepository, never()).save(any());
    }

    @Test
    void getSubmissionById_Success() {
        when(problemSubmissionRepository.findById(1L)).thenReturn(Optional.of(submission));

        ProblemSubmissionResponse response = problemSubmissionService.getSubmissionById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(1L, response.getProblemId());
        assertEquals("Test Problem", response.getProblemTitle());
        assertEquals("testuser", response.getUsername());
        assertEquals("20", response.getSubmittedAnswer());
        assertTrue(response.getIsCorrect());
        assertEquals(100, response.getScore());

        verify(problemSubmissionRepository).findById(1L);
    }

    @Test
    void getSubmissionById_NotFound() {
        when(problemSubmissionRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            problemSubmissionService.getSubmissionById(1L);
        });

        verify(problemSubmissionRepository).findById(1L);
    }

    @Test
    void getSubmissionsByUser_Success() {
        Page<ProblemSubmission> submissionPage = new PageImpl<>(List.of(submission));
        Pageable pageable = PageRequest.of(0, 10);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(problemSubmissionRepository.findByUser(user, pageable)).thenReturn(submissionPage);

        Page<ProblemSubmissionResponse> response = problemSubmissionService.getSubmissionsByUser(1L, pageable);

        assertNotNull(response);
        assertEquals(1, response.getTotalElements());
        assertEquals(1, response.getContent().size());
        assertEquals(1L, response.getContent().get(0).getId());
        assertEquals("Test Problem", response.getContent().get(0).getProblemTitle());
        assertEquals("testuser", response.getContent().get(0).getUsername());

        verify(userRepository).findById(1L);
        verify(problemSubmissionRepository).findByUser(user, pageable);
    }

    @Test
    void getSubmissionsByProblem_Success() {
        Page<ProblemSubmission> submissionPage = new PageImpl<>(List.of(submission));
        Pageable pageable = PageRequest.of(0, 10);

        when(problemRepository.findById(1L)).thenReturn(Optional.of(problem));
        when(problemSubmissionRepository.findByProblem(problem, pageable)).thenReturn(submissionPage);

        Page<ProblemSubmissionResponse> response = problemSubmissionService.getSubmissionsByProblem(1L, pageable);

        assertNotNull(response);
        assertEquals(1, response.getTotalElements());
        assertEquals(1, response.getContent().size());
        assertEquals(1L, response.getContent().get(0).getId());
        assertEquals("Test Problem", response.getContent().get(0).getProblemTitle());
        assertEquals("testuser", response.getContent().get(0).getUsername());

        verify(problemRepository).findById(1L);
        verify(problemSubmissionRepository).findByProblem(problem, pageable);
    }

    @Test
    void getBestSubmissionByUserAndProblem_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(problemRepository.findById(1L)).thenReturn(Optional.of(problem));
        when(problemSubmissionRepository.findBestSubmissionByUserAndProblem(user, problem)).thenReturn(Optional.of(submission));

        ProblemSubmissionResponse response = problemSubmissionService.getBestSubmissionByUserAndProblem(1L, 1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(1L, response.getProblemId());
        assertEquals("Test Problem", response.getProblemTitle());
        assertEquals("testuser", response.getUsername());
        assertEquals("20", response.getSubmittedAnswer());
        assertTrue(response.getIsCorrect());
        assertEquals(100, response.getScore());

        verify(userRepository).findById(1L);
        verify(problemRepository).findById(1L);
        verify(problemSubmissionRepository).findBestSubmissionByUserAndProblem(user, problem);
    }

    @Test
    void getBestSubmissionByUserAndProblem_NotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(problemRepository.findById(1L)).thenReturn(Optional.of(problem));
        when(problemSubmissionRepository.findBestSubmissionByUserAndProblem(user, problem)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            problemSubmissionService.getBestSubmissionByUserAndProblem(1L, 1L);
        });

        verify(userRepository).findById(1L);
        verify(problemRepository).findById(1L);
        verify(problemSubmissionRepository).findBestSubmissionByUserAndProblem(user, problem);
    }

    @Test
    void countSolvedProblemsByUser_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(problemSubmissionRepository.countSolvedProblemsByUser(user)).thenReturn(5L);

        Long count = problemSubmissionService.countSolvedProblemsByUser(1L);

        assertEquals(5L, count);

        verify(userRepository).findById(1L);
        verify(problemSubmissionRepository).countSolvedProblemsByUser(user);
    }

    @Test
    void getTotalScoreByUser_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(problemSubmissionRepository.getTotalScoreByUser(user)).thenReturn(500);

        Integer score = problemSubmissionService.getTotalScoreByUser(1L);

        assertEquals(500, score);

        verify(userRepository).findById(1L);
        verify(problemSubmissionRepository).getTotalScoreByUser(user);
    }

    @Test
    void getTotalScoreByUser_NullScore() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(problemSubmissionRepository.getTotalScoreByUser(user)).thenReturn(null);

        Integer score = problemSubmissionService.getTotalScoreByUser(1L);

        assertEquals(0, score);

        verify(userRepository).findById(1L);
        verify(problemSubmissionRepository).getTotalScoreByUser(user);
    }
}
