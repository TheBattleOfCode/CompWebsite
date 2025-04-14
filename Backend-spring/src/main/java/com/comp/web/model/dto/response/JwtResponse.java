package com.comp.web.model.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {
    @JsonProperty("access_token")
    private String token;
    private String type = "Bearer";
    @JsonProperty("refresh_token")
    private String refreshToken;
    private Long id;
    private String username;
    private String email;
    private List<String> roles;
}
