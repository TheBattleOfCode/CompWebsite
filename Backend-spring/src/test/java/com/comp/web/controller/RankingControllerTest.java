package com.comp.web.controller;

import com.comp.web.model.dto.response.UserRankingResponse;
import com.comp.web.service.RankingService;
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

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class RankingControllerTest {

    private MockMvc mockMvc;

    @Mock
    private RankingService rankingService;

    @InjectMocks
    private RankingController rankingController;

    private ObjectMapper objectMapper;
    private UserRankingResponse userRanking1;
    private UserRankingResponse userRanking2;
    private UserRankingResponse userRanking3;
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
                .standaloneSetup(rankingController)
                .setControllerAdvice(new com.comp.web.exception.ControllerExceptionHandler())
                .setMessageConverters(converter)
                .build();

        userDetails = new UserDetailsImpl(1L, "testuser", "test@example.com", "password", 
                List.of(new SimpleGrantedAuthority("ROLE_USER")));

        userRanking1 = UserRankingResponse.builder()
                .userId(1L)
                .username("user1")
                .displayName("User One")
                .globalRank(1)
                .countryRank(1)
                .establishmentRank(1)
                .country("US")
                .establishment("University A")
                .totalScore(1000)
                .solvedProblems(5)
                .totalSubmissions(10)
                .build();

        userRanking2 = UserRankingResponse.builder()
                .userId(2L)
                .username("user2")
                .displayName("User Two")
                .globalRank(2)
                .countryRank(2)
                .establishmentRank(2)
                .country("US")
                .establishment("University A")
                .totalScore(800)
                .solvedProblems(4)
                .totalSubmissions(8)
                .build();

        userRanking3 = UserRankingResponse.builder()
                .userId(3L)
                .username("user3")
                .displayName("User Three")
                .globalRank(3)
                .countryRank(1)
                .establishmentRank(1)
                .country("CA")
                .establishment("University B")
                .totalScore(600)
                .solvedProblems(3)
                .totalSubmissions(6)
                .build();
        
        // Setup SecurityContext
        authentication = new TestAuthentication(userDetails, userDetails.getAuthorities());
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(authentication);
        SecurityContextHolder.setContext(securityContext);
        
        // Setup service mocks
        List<UserRankingResponse> globalRankings = Arrays.asList(userRanking1, userRanking2, userRanking3);
        Page<UserRankingResponse> globalRankingsPage = new PageImpl<>(globalRankings);
        lenient().when(rankingService.getGlobalRankings(any(Pageable.class))).thenReturn(globalRankingsPage);
        
        List<UserRankingResponse> usRankings = Arrays.asList(userRanking1, userRanking2);
        Page<UserRankingResponse> usRankingsPage = new PageImpl<>(usRankings);
        lenient().when(rankingService.getCountryRankings(eq("US"), any(Pageable.class))).thenReturn(usRankingsPage);
        
        List<UserRankingResponse> uniARankings = Arrays.asList(userRanking1, userRanking2);
        Page<UserRankingResponse> uniARankingsPage = new PageImpl<>(uniARankings);
        lenient().when(rankingService.getEstablishmentRankings(eq(1L), any(Pageable.class))).thenReturn(uniARankingsPage);
        
        lenient().when(rankingService.getUserRanking(1L)).thenReturn(userRanking1);
        
        lenient().doNothing().when(rankingService).recalculateRankings();
    }

    @Test
    void getGlobalRankings_Success() throws Exception {
        mockMvc.perform(get("/rankings/global")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].userId").value(1))
                .andExpect(jsonPath("$.content[0].username").value("user1"))
                .andExpect(jsonPath("$.content[0].globalRank").value(1))
                .andExpect(jsonPath("$.content[1].userId").value(2))
                .andExpect(jsonPath("$.content[2].userId").value(3));

        verify(rankingService).getGlobalRankings(any(Pageable.class));
    }

    @Test
    void getCountryRankings_Success() throws Exception {
        mockMvc.perform(get("/rankings/country/US")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].userId").value(1))
                .andExpect(jsonPath("$.content[0].country").value("US"))
                .andExpect(jsonPath("$.content[0].countryRank").value(1))
                .andExpect(jsonPath("$.content[1].userId").value(2))
                .andExpect(jsonPath("$.content[1].countryRank").value(2));

        verify(rankingService).getCountryRankings(eq("US"), any(Pageable.class));
    }

    @Test
    void getEstablishmentRankings_Success() throws Exception {
        mockMvc.perform(get("/rankings/establishment/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].userId").value(1))
                .andExpect(jsonPath("$.content[0].establishment").value("University A"))
                .andExpect(jsonPath("$.content[0].establishmentRank").value(1))
                .andExpect(jsonPath("$.content[1].userId").value(2))
                .andExpect(jsonPath("$.content[1].establishmentRank").value(2));

        verify(rankingService).getEstablishmentRankings(eq(1L), any(Pageable.class));
    }

    @Test
    void getUserRanking_Success() throws Exception {
        mockMvc.perform(get("/rankings/user/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(1))
                .andExpect(jsonPath("$.username").value("user1"))
                .andExpect(jsonPath("$.displayName").value("User One"))
                .andExpect(jsonPath("$.globalRank").value(1))
                .andExpect(jsonPath("$.countryRank").value(1))
                .andExpect(jsonPath("$.establishmentRank").value(1))
                .andExpect(jsonPath("$.country").value("US"))
                .andExpect(jsonPath("$.establishment").value("University A"))
                .andExpect(jsonPath("$.totalScore").value(1000))
                .andExpect(jsonPath("$.solvedProblems").value(5));

        verify(rankingService).getUserRanking(1L);
    }

    @Test
    void recalculateRankings_Success() throws Exception {
        mockMvc.perform(post("/rankings/recalculate")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(rankingService).recalculateRankings();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }
}
