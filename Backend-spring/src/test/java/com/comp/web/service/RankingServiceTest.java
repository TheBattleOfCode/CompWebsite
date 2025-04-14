package com.comp.web.service;

import com.comp.web.model.dto.response.UserRankingResponse;
import com.comp.web.model.entity.User;
import com.comp.web.repository.ProblemSubmissionRepository;
import com.comp.web.repository.UserRepository;
import com.comp.web.service.impl.RankingServiceImpl;
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

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RankingServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProblemSubmissionRepository problemSubmissionRepository;

    @InjectMocks
    private RankingServiceImpl rankingService;

    private User user1;
    private User user2;
    private User user3;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        user1 = new User();
        user1.setId(1L);
        user1.setUsername("user1");
        user1.setEmail("user1@example.com");
        user1.setPassword("password");
        user1.setDisplayName("User One");
        user1.setCountryCode("US");
        user1.setEstablishment("University A");
        user1.setTotalScore(1000);
        user1.setGlobalRank(1);
        user1.setCountryRank(1);
        user1.setEstablishmentRank(1);

        user2 = new User();
        user2.setId(2L);
        user2.setUsername("user2");
        user2.setEmail("user2@example.com");
        user2.setPassword("password");
        user2.setDisplayName("User Two");
        user2.setCountryCode("US");
        user2.setEstablishment("University A");
        user2.setTotalScore(800);
        user2.setGlobalRank(2);
        user2.setCountryRank(2);
        user2.setEstablishmentRank(2);

        user3 = new User();
        user3.setId(3L);
        user3.setUsername("user3");
        user3.setEmail("user3@example.com");
        user3.setPassword("password");
        user3.setDisplayName("User Three");
        user3.setCountryCode("CA");
        user3.setEstablishment("University B");
        user3.setTotalScore(600);
        user3.setGlobalRank(3);
        user3.setCountryRank(1);
        user3.setEstablishmentRank(1);

        pageable = PageRequest.of(0, 10);
    }

    @Test
    void getGlobalRankings_Success() {
        List<User> users = Arrays.asList(user1, user2, user3);
        Page<User> userPage = new PageImpl<>(users, pageable, users.size());

        when(userRepository.findAllByOrderByGlobalRankAsc(pageable)).thenReturn(userPage);
        when(problemSubmissionRepository.countSolvedProblemsByUser(any(User.class))).thenReturn(5L);

        Page<UserRankingResponse> result = rankingService.getGlobalRankings(pageable);

        assertNotNull(result);
        assertEquals(3, result.getTotalElements());
        assertEquals(1, result.getContent().get(0).getGlobalRank());
        assertEquals(2, result.getContent().get(1).getGlobalRank());
        assertEquals(3, result.getContent().get(2).getGlobalRank());
        assertEquals("User One", result.getContent().get(0).getDisplayName());
        assertEquals("User Two", result.getContent().get(1).getDisplayName());
        assertEquals("User Three", result.getContent().get(2).getDisplayName());

        verify(userRepository).findAllByOrderByGlobalRankAsc(pageable);
        verify(problemSubmissionRepository, times(3)).countSolvedProblemsByUser(any(User.class));
    }

    @Test
    void getCountryRankings_Success() {
        List<User> users = Arrays.asList(user1, user2);
        Page<User> userPage = new PageImpl<>(users, pageable, users.size());

        when(userRepository.findByCountryCodeOrderByCountryRankAsc(eq("US"), any(Pageable.class))).thenReturn(userPage);
        when(problemSubmissionRepository.countSolvedProblemsByUser(any(User.class))).thenReturn(5L);

        Page<UserRankingResponse> result = rankingService.getCountryRankings("US", pageable);

        assertNotNull(result);
        assertEquals(2, result.getTotalElements());
        assertEquals(1, result.getContent().get(0).getCountryRank());
        assertEquals(2, result.getContent().get(1).getCountryRank());
        assertEquals("US", result.getContent().get(0).getCountry());
        assertEquals("US", result.getContent().get(1).getCountry());

        verify(userRepository).findByCountryCodeOrderByCountryRankAsc(eq("US"), any(Pageable.class));
        verify(problemSubmissionRepository, times(2)).countSolvedProblemsByUser(any(User.class));
    }

    @Test
    void getEstablishmentRankings_Success() {
        List<User> users = Arrays.asList(user1, user2);
        Page<User> userPage = new PageImpl<>(users, pageable, users.size());

        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));
        when(userRepository.findByEstablishmentOrderByEstablishmentRankAsc(eq("University A"), any(Pageable.class))).thenReturn(userPage);
        when(problemSubmissionRepository.countSolvedProblemsByUser(any(User.class))).thenReturn(5L);

        Page<UserRankingResponse> result = rankingService.getEstablishmentRankings(1L, pageable);

        assertNotNull(result);
        assertEquals(2, result.getTotalElements());
        assertEquals(1, result.getContent().get(0).getEstablishmentRank());
        assertEquals(2, result.getContent().get(1).getEstablishmentRank());
        assertEquals("University A", result.getContent().get(0).getEstablishment());
        assertEquals("University A", result.getContent().get(1).getEstablishment());

        verify(userRepository).findById(1L);
        verify(userRepository).findByEstablishmentOrderByEstablishmentRankAsc(eq("University A"), any(Pageable.class));
        verify(problemSubmissionRepository, times(2)).countSolvedProblemsByUser(any(User.class));
    }

    @Test
    void getUserRanking_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));
        when(problemSubmissionRepository.countSolvedProblemsByUser(user1)).thenReturn(5L);

        UserRankingResponse result = rankingService.getUserRanking(1L);

        assertNotNull(result);
        assertEquals(1L, result.getUserId());
        assertEquals("user1", result.getUsername());
        assertEquals("User One", result.getDisplayName());
        assertEquals(1, result.getGlobalRank());
        assertEquals(1, result.getCountryRank());
        assertEquals(1, result.getEstablishmentRank());
        assertEquals("US", result.getCountry());
        assertEquals("University A", result.getEstablishment());
        assertEquals(1000, result.getTotalScore());
        assertEquals(5, result.getSolvedProblems());

        verify(userRepository).findById(1L);
        verify(problemSubmissionRepository).countSolvedProblemsByUser(user1);
    }

    @Test
    void recalculateRankings_Success() {
        List<User> allUsers = Arrays.asList(user1, user2, user3);
        List<User> usUsers = Arrays.asList(user1, user2);
        List<User> caUsers = Arrays.asList(user3);
        List<User> uniAUsers = Arrays.asList(user1, user2);
        List<User> uniBUsers = Arrays.asList(user3);

        when(userRepository.findAll()).thenReturn(allUsers);
        when(problemSubmissionRepository.getTotalScoreByUser(user1)).thenReturn(1000);
        when(problemSubmissionRepository.getTotalScoreByUser(user2)).thenReturn(800);
        when(problemSubmissionRepository.getTotalScoreByUser(user3)).thenReturn(600);
        when(userRepository.findAllByOrderByTotalScoreDesc()).thenReturn(allUsers);
        when(userRepository.findByCountryCodeOrderByTotalScoreDesc("US")).thenReturn(usUsers);
        when(userRepository.findByCountryCodeOrderByTotalScoreDesc("CA")).thenReturn(caUsers);
        when(userRepository.findByEstablishmentOrderByTotalScoreDesc("University A")).thenReturn(uniAUsers);
        when(userRepository.findByEstablishmentOrderByTotalScoreDesc("University B")).thenReturn(uniBUsers);

        rankingService.recalculateRankings();

        verify(userRepository).findAll();
        verify(problemSubmissionRepository, times(3)).getTotalScoreByUser(any(User.class));
        verify(userRepository).saveAll(allUsers);
        verify(userRepository).findAllByOrderByTotalScoreDesc();
        verify(userRepository, times(3)).updateGlobalRank(anyLong(), anyInt());
        verify(userRepository).findByCountryCodeOrderByTotalScoreDesc("US");
        verify(userRepository).findByCountryCodeOrderByTotalScoreDesc("CA");
        verify(userRepository, times(3)).updateCountryRank(anyLong(), anyInt());
        verify(userRepository).findByEstablishmentOrderByTotalScoreDesc("University A");
        verify(userRepository).findByEstablishmentOrderByTotalScoreDesc("University B");
        verify(userRepository, times(3)).updateEstablishmentRank(anyLong(), anyInt());
    }
}
