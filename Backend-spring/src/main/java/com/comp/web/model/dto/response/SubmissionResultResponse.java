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
public class SubmissionResultResponse {
    @JsonProperty("submission_id")
    private Long submissionId;
    @JsonProperty("is_correct")
    private Boolean isCorrect;
    private Integer score;
    private String message;
}
