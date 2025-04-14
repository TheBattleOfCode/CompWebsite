package com.comp.web.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmitProblemRequest {
    @NotNull(message = "Problem ID is required")
    private Long problemId;
    
    @NotBlank(message = "Answer is required")
    private String answer;
}
