package com.comp.web.service;

import com.comp.web.model.dto.request.LoginRequest;
import com.comp.web.model.dto.request.SignupRequest;
import com.comp.web.model.dto.request.TokenRefreshRequest;
import com.comp.web.model.dto.response.JwtResponse;
import com.comp.web.model.dto.response.MessageResponse;
import com.comp.web.model.dto.response.TokenRefreshResponse;

public interface AuthService {

    /**
     * Authenticate a user and generate JWT tokens
     *
     * @param loginRequest the login credentials
     * @return JWT response with tokens and user details
     */
    JwtResponse authenticateUser(LoginRequest loginRequest);

    /**
     * Register a new user
     *
     * @param signupRequest the registration details
     * @return message response indicating success or failure
     */
    MessageResponse registerUser(SignupRequest signupRequest);

    /**
     * Refresh an access token using a refresh token
     *
     * @param request the refresh token request
     * @return new access and refresh tokens
     */
    TokenRefreshResponse refreshToken(TokenRefreshRequest request);

    /**
     * Validate an access token
     *
     * @param accessToken the access token to validate
     * @return true if the token is valid, false otherwise
     */
    boolean validateAccessToken(String accessToken);

    /**
     * Log out a user by invalidating their refresh token
     *
     * @param userId the ID of the user to log out
     * @return message response indicating success
     */
    MessageResponse logoutUser(Long userId);
}
