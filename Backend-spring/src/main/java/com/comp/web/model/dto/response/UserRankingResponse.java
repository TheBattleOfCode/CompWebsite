package com.comp.web.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRankingResponse {
    private Long userId;
    private String username;
    private String displayName;
    private String profileImageUrl;
    private Integer globalRank;
    private Integer countryRank;
    private Integer establishmentRank;
    private String country;
    private String establishment;
    private Integer totalScore;
    private Integer solvedProblems;
    private Integer totalSubmissions;
}
