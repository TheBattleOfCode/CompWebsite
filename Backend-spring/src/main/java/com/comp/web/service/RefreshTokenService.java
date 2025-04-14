package com.comp.web.service;

import com.comp.web.exception.TokenRefreshException;
import com.comp.web.model.entity.RefreshToken;
import com.comp.web.model.entity.User;

import java.util.Optional;

public interface RefreshTokenService {
    
    /**
     * Find a refresh token by token string
     * 
     * @param token the token string
     * @return an Optional containing the refresh token if found
     */
    Optional<RefreshToken> findByToken(String token);
    
    /**
     * Create a new refresh token for a user
     * 
     * @param userId the user ID
     * @return the created refresh token
     */
    RefreshToken createRefreshToken(Long userId);
    
    /**
     * Verify if a refresh token is valid and not expired
     * 
     * @param token the refresh token to verify
     * @return the verified refresh token
     * @throws TokenRefreshException if the token is expired or invalid
     */
    RefreshToken verifyExpiration(RefreshToken token) throws TokenRefreshException;
    
    /**
     * Delete all refresh tokens for a user
     * 
     * @param user the user whose tokens should be deleted
     * @return the number of tokens deleted
     */
    int deleteByUser(User user);
}
