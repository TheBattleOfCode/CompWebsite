package com.comp.web.controller;

import com.comp.web.model.dto.response.UserRankingResponse;
import org.springframework.data.domain.PageImpl;
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

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class RankingControllerTest {

    @JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
    @JsonIgnoreProperties({"pageable", "sort"})
    abstract static class PageMixIn {
        @JsonProperty("content")
        List<?> content;
        @JsonProperty("totalElements")
        long totalElements;
        @JsonProperty("totalPages")
        int totalPages;
        @JsonProperty("number")
        int number;
        @JsonProperty("size")
        int size;
    }

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
        // Configure ObjectMapper to handle LocalDateTime and Page objects
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        objectMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        // Add mix-in to handle Page serialization
        objectMapper.addMixIn(Page.class, PageMixIn.class);

        // Create a custom HttpMessageConverter for handling Page objects
        MappingJackson2HttpMessageConverter jsonConverter = new MappingJackson2HttpMessageConverter();
        jsonConverter.setObjectMapper(objectMapper);

        // Create a StringHttpMessageConverter for plain text responses
        org.springframework.http.converter.StringHttpMessageConverter stringConverter =
                new org.springframework.http.converter.StringHttpMessageConverter();

        mockMvc = MockMvcBuilders
                .standaloneSetup(rankingController)
                .setControllerAdvice(new com.comp.web.exception.ControllerExceptionHandler())
                .setMessageConverters(jsonConverter, stringConverter)
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
                .andExpect(jsonPath("$.data[0].user_id").value(1))
                .andExpect(jsonPath("$.data[0].username").value("user1"))
                .andExpect(jsonPath("$.data[0].global_rank").value(1))
                .andExpect(jsonPath("$.data[1].user_id").value(2))
                .andExpect(jsonPath("$.data[2].user_id").value(3))
                .andExpect(jsonPath("$.total_count").exists());

        verify(rankingService).getGlobalRankings(any(Pageable.class));
    }

    @Test
    void getCountryRankings_Success() throws Exception {
        mockMvc.perform(get("/rankings/country/US")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].user_id").value(1))
                .andExpect(jsonPath("$.data[0].country").value("US"))
                .andExpect(jsonPath("$.data[0].country_rank").value(1))
                .andExpect(jsonPath("$.data[1].user_id").value(2))
                .andExpect(jsonPath("$.data[1].country_rank").value(2))
                .andExpect(jsonPath("$.total_count").exists());

        verify(rankingService).getCountryRankings(eq("US"), any(Pageable.class));
    }

    @Test
    void getEstablishmentRankings_Success() throws Exception {
        mockMvc.perform(get("/rankings/establishment/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].user_id").value(1))
                .andExpect(jsonPath("$.data[0].establishment").value("University A"))
                .andExpect(jsonPath("$.data[0].establishment_rank").value(1))
                .andExpect(jsonPath("$.data[1].user_id").value(2))
                .andExpect(jsonPath("$.data[1].establishment_rank").value(2))
                .andExpect(jsonPath("$.total_count").exists());

        verify(rankingService).getEstablishmentRankings(eq(1L), any(Pageable.class));
    }

    @Test
    void getUserRanking_Success() throws Exception {
        mockMvc.perform(get("/rankings/user/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.user_id").value(1))
                .andExpect(jsonPath("$.data.username").value("user1"))
                .andExpect(jsonPath("$.data.display_name").value("User One"))
                .andExpect(jsonPath("$.data.global_rank").value(1))
                .andExpect(jsonPath("$.data.country_rank").value(1))
                .andExpect(jsonPath("$.data.establishment_rank").value(1))
                .andExpect(jsonPath("$.data.country").value("US"))
                .andExpect(jsonPath("$.data.establishment").value("University A"))
                .andExpect(jsonPath("$.data.total_score").value(1000))
                .andExpect(jsonPath("$.data.solved_problems").value(5));

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
