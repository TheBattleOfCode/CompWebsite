package com.comp.web.security.jwt;

import org.springframework.security.core.Authentication;

public interface JwtUtilsInterface {
    String generateJwtToken(Authentication authentication);
    String generateTokenFromUsername(String username);
    String getUserNameFromJwtToken(String token);
    boolean validateJwtToken(String authToken);
}
