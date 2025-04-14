package com.comp.web.model.dto.response;

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
public class ProblemSubmissionResponse implements Pageable {
    private Long id;
    @JsonProperty("problem_id")
    private Long problemId;
    @JsonProperty("problem_title")
    private String problemTitle;
    private String username;
    @JsonProperty("submitted_answer")
    private String submittedAnswer;
    @JsonProperty("is_correct")
    private Boolean isCorrect;
    private Integer score;
    @JsonProperty("submitted_at")
    private LocalDateTime submittedAt;
}
