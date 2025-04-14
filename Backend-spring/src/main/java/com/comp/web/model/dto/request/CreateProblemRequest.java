package com.comp.web.model.dto.request;

import com.comp.web.model.entity.EProblemType;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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
public class CreateProblemRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotNull(message = "Problem type is required")
    private EProblemType type;

    @JsonProperty("input_generator_code")
    private String inputGeneratorCode;

    @JsonProperty("output_generator_code")
    private String outputGeneratorCode;

    @JsonProperty("sample_input")
    private String sampleInput;

    @JsonProperty("sample_output")
    private String sampleOutput;
    
    @NotNull(message = "Difficulty level is required")
    @Min(value = 1, message = "Difficulty level must be between 1 and 10")
    @Max(value = 10, message = "Difficulty level must be between 1 and 10")
    @JsonProperty("difficulty_level")
    private Integer difficultyLevel;
    
    @NotNull(message = "Max score is required")
    @Min(value = 1, message = "Max score must be positive")
    @JsonProperty("max_score")
    private Integer maxScore;
}
