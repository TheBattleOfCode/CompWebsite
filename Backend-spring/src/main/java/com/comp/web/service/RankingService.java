package com.comp.web.service;

import com.comp.web.model.dto.response.UserRankingResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RankingService {
    /**
     * Get global rankings of users based on their total score
     *
     * @param pageable pagination information
     * @return a page of user rankings
     */
    Page<UserRankingResponse> getGlobalRankings(Pageable pageable);

    /**
     * Get rankings of users from a specific country
     *
     * @param countryCode the country code (ISO 3166-1 alpha-2)
     * @param pageable pagination information
     * @return a page of user rankings
     */
    Page<UserRankingResponse> getCountryRankings(String countryCode, Pageable pageable);

    /**
     * Get rankings of users from a specific establishment
     *
     * @param establishmentId the establishment ID
     * @param pageable pagination information
     * @return a page of user rankings
     */
    Page<UserRankingResponse> getEstablishmentRankings(Long establishmentId, Pageable pageable);

    /**
     * Get the ranking of a specific user
     *
     * @param userId the user ID
     * @return the user's ranking information
     */
    UserRankingResponse getUserRanking(Long userId);

    /**
     * Recalculate rankings for all users
     * This method should be called periodically or after significant changes
     */
    void recalculateRankings();
}
