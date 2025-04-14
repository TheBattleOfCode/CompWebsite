package com.comp.web.model.dto.response;

import com.comp.web.model.entity.EProblemType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProblemResponse {
    private Long id;
    private String title;
    private String description;
    private EProblemType type;
    private String sampleInput;
    private String sampleOutput;
    private Integer difficultyLevel;
    private Integer maxScore;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdByUsername;
}
