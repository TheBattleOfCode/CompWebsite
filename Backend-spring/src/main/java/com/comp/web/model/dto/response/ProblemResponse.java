package com.comp.web.model.dto.response;

import com.comp.web.model.entity.EProblemType;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProblemResponse implements Pageable {
    private Long id;
    private String title;
    private String description;
    private EProblemType type;
    @JsonProperty("sample_input")
    private String sampleInput;
    @JsonProperty("sample_output")
    private String sampleOutput;
    @JsonProperty("difficulty_level")
    private Integer difficultyLevel;
    @JsonProperty("max_score")
    private Integer maxScore;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    @JsonProperty("created_by_username")
    private String createdByUsername;
}
