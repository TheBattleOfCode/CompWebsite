package com.comp.web.model.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRankingResponse implements Pageable {
    @JsonProperty("user_id")
    private Long userId;
    private String username;
    @JsonProperty("display_name")
    private String displayName;
    @JsonProperty("profile_image_url")
    private String profileImageUrl;
    @JsonProperty("global_rank")
    private Integer globalRank;
    @JsonProperty("country_rank")
    private Integer countryRank;
    @JsonProperty("establishment_rank")
    private Integer establishmentRank;
    private String country;
    private String establishment;
    @JsonProperty("total_score")
    private Integer totalScore;
    @JsonProperty("solved_problems")
    private Integer solvedProblems;
    @JsonProperty("total_submissions")
    private Integer totalSubmissions;
}
