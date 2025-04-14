package com.comp.web.service.impl;

import com.comp.web.exception.ResourceNotFoundException;
import com.comp.web.model.dto.response.UserRankingResponse;
import com.comp.web.model.entity.User;
import com.comp.web.repository.ProblemSubmissionRepository;
import com.comp.web.repository.UserRepository;
import com.comp.web.service.RankingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RankingServiceImpl implements RankingService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProblemSubmissionRepository problemSubmissionRepository;

    @Override
    public Page<UserRankingResponse> getGlobalRankings(Pageable pageable) {
        Page<User> users = userRepository.findAllByOrderByGlobalRankAsc(pageable);
        List<UserRankingResponse> rankings = users.getContent().stream()
                .map(this::mapUserToRankingResponse)
                .collect(Collectors.toList());
        
        return new PageImpl<>(rankings, pageable, users.getTotalElements());
    }

    @Override
    public Page<UserRankingResponse> getCountryRankings(String countryCode, Pageable pageable) {
        Page<User> users = userRepository.findByCountryCodeOrderByCountryRankAsc(countryCode, pageable);
        List<UserRankingResponse> rankings = users.getContent().stream()
                .map(this::mapUserToRankingResponse)
                .collect(Collectors.toList());
        
        return new PageImpl<>(rankings, pageable, users.getTotalElements());
    }

    @Override
    public Page<UserRankingResponse> getEstablishmentRankings(Long establishmentId, Pageable pageable) {
        // In this implementation, we're using the establishment name directly
        // In a more complex system, you might have an Establishment entity with an ID
        User user = userRepository.findById(establishmentId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", establishmentId));
        
        if (user.getEstablishment() == null) {
            throw new ResourceNotFoundException("Establishment", "user id", establishmentId);
        }
        
        Page<User> users = userRepository.findByEstablishmentOrderByEstablishmentRankAsc(user.getEstablishment(), pageable);
        List<UserRankingResponse> rankings = users.getContent().stream()
                .map(this::mapUserToRankingResponse)
                .collect(Collectors.toList());
        
        return new PageImpl<>(rankings, pageable, users.getTotalElements());
    }

    @Override
    public UserRankingResponse getUserRanking(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        return mapUserToRankingResponse(user);
    }

    @Override
    @Transactional
    @Scheduled(cron = "0 0 * * * *") // Run every hour
    public void recalculateRankings() {
        // Recalculate total scores
        List<User> allUsers = userRepository.findAll();
        for (User user : allUsers) {
            Integer totalScore = problemSubmissionRepository.getTotalScoreByUser(user);
            if (totalScore == null) {
                totalScore = 0;
            }
            user.setTotalScore(totalScore);
        }
        userRepository.saveAll(allUsers);
        
        // Recalculate global rankings
        List<User> globalRankedUsers = userRepository.findAllByOrderByTotalScoreDesc();
        for (int i = 0; i < globalRankedUsers.size(); i++) {
            User user = globalRankedUsers.get(i);
            userRepository.updateGlobalRank(user.getId(), i + 1);
        }
        
        // Recalculate country rankings
        List<String> countries = allUsers.stream()
                .map(User::getCountryCode)
                .filter(countryCode -> countryCode != null && !countryCode.isEmpty())
                .distinct()
                .collect(Collectors.toList());
        
        for (String countryCode : countries) {
            List<User> countryUsers = userRepository.findByCountryCodeOrderByTotalScoreDesc(countryCode);
            for (int i = 0; i < countryUsers.size(); i++) {
                User user = countryUsers.get(i);
                userRepository.updateCountryRank(user.getId(), i + 1);
            }
        }
        
        // Recalculate establishment rankings
        List<String> establishments = allUsers.stream()
                .map(User::getEstablishment)
                .filter(establishment -> establishment != null && !establishment.isEmpty())
                .distinct()
                .collect(Collectors.toList());
        
        for (String establishment : establishments) {
            List<User> establishmentUsers = userRepository.findByEstablishmentOrderByTotalScoreDesc(establishment);
            for (int i = 0; i < establishmentUsers.size(); i++) {
                User user = establishmentUsers.get(i);
                userRepository.updateEstablishmentRank(user.getId(), i + 1);
            }
        }
    }
    
    private UserRankingResponse mapUserToRankingResponse(User user) {
        Long solvedProblems = problemSubmissionRepository.countSolvedProblemsByUser(user);
        
        return UserRankingResponse.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .displayName(user.getDisplayName() != null ? user.getDisplayName() : user.getUsername())
                .profileImageUrl(user.getProfileImageUrl())
                .globalRank(user.getGlobalRank())
                .countryRank(user.getCountryRank())
                .establishmentRank(user.getEstablishmentRank())
                .country(user.getCountryCode())
                .establishment(user.getEstablishment())
                .totalScore(user.getTotalScore())
                .solvedProblems(solvedProblems != null ? solvedProblems.intValue() : 0)
                .totalSubmissions(0) // This would require a new query to count all submissions
                .build();
    }
}
