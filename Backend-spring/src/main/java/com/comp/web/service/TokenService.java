package com.comp.web.service;

import com.comp.web.exception.TokenRefreshException;
import com.comp.web.model.entity.Token;
import com.comp.web.model.entity.User;

import java.util.Optional;

public interface TokenService {
    
    /**
     * Find a token by access token string
     * 
     * @param accessToken the access token string
     * @return an Optional containing the token if found
     */
    Optional<Token> findByAccessToken(String accessToken);
    
    /**
     * Find a token by refresh token string
     * 
     * @param refreshToken the refresh token string
     * @return an Optional containing the token if found
     */
    Optional<Token> findByRefreshToken(String refreshToken);
    
    /**
     * Create a new token for a user
     * 
     * @param userId the user ID
     * @param accessToken the access token string
     * @param refreshToken the refresh token string
     * @return the created token
     */
    Token createToken(Long userId, String accessToken, String refreshToken);
    
    /**
     * Verify if a token is valid, not expired, and not invoked
     * 
     * @param token the token to verify
     * @return the verified token
     * @throws TokenRefreshException if the token is expired, invoked, or invalid
     */
    Token verifyRefreshTokenExpirationAndInvocation(Token token) throws TokenRefreshException;
    
    /**
     * Mark a token as invoked (used for refresh)
     * 
     * @param token the token to mark as invoked
     * @return the updated token
     */
    Token markAsInvoked(Token token);
    
    /**
     * Delete all tokens for a user
     * 
     * @param user the user whose tokens should be deleted
     * @return the number of tokens deleted
     */
    int deleteByUser(User user);
}
