package com.comp.web.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProblemSubmissionResponse {
    private Long id;
    private Long problemId;
    private String problemTitle;
    private String username;
    private String submittedAnswer;
    private Boolean isCorrect;
    private Integer score;
    private LocalDateTime submittedAt;
}
