package com.comp.web.model.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TokenRefreshRequest {
    @NotBlank(message = "Refresh token is required")
    @JsonProperty("refresh_token")
    private String refreshToken;
}
