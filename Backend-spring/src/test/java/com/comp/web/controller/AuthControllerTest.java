package com.comp.web.controller;

import com.comp.web.exception.TokenRefreshException;
import com.comp.web.model.dto.request.LoginRequest;
import com.comp.web.model.dto.request.SignupRequest;
import com.comp.web.model.dto.request.TokenRefreshRequest;
import com.comp.web.model.dto.response.JwtResponse;
import com.comp.web.model.dto.response.MessageResponse;
import com.comp.web.model.dto.response.TokenRefreshResponse;
import com.comp.web.model.entity.ERole;
import com.comp.web.model.entity.Role;
import com.comp.web.model.entity.Token;
import com.comp.web.model.entity.User;
import com.comp.web.service.AuthService;
import com.comp.web.service.TestAuthentication;
import com.comp.web.service.impl.UserDetailsImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class AuthControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    private ObjectMapper objectMapper = new ObjectMapper();
    private LoginRequest loginRequest;
    private SignupRequest signupRequest;
    private TokenRefreshRequest tokenRefreshRequest;
    private JwtResponse jwtResponse;
    private TokenRefreshResponse tokenRefreshResponse;
    private User user;
    private Role role;
    private Authentication authentication;
    private UserDetailsImpl userDetails;


    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(authController)
                .setControllerAdvice(new com.comp.web.exception.ControllerExceptionHandler())
                .build();
        loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password");

        signupRequest = new SignupRequest();
        signupRequest.setUsername("newuser");
        signupRequest.setEmail("newuser@example.com");
        signupRequest.setPassword("password");
        signupRequest.setRoles(Set.of(ERole.ROLE_USER));

        tokenRefreshRequest = new TokenRefreshRequest();
        tokenRefreshRequest.setRefreshToken("refresh_token");

        jwtResponse = JwtResponse.builder()
                .token("access_token")
                .refreshToken("refresh_token")
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .roles(List.of("ROLE_USER"))
                .build();

        tokenRefreshResponse = new TokenRefreshResponse("new_access_token", "new_refresh_token", "Bearer");

        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPassword("encoded_password");

        role = new Role();
        role.setId(1);
        role.setName(ERole.ROLE_USER);
        Set<Role> roles = new HashSet<>();
        roles.add(role);
        user.setRoles(roles);

        List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));
        UserDetailsImpl userDetails = new UserDetailsImpl(1L, "testuser", "test@example.com", "encoded_password", authorities);

        // Create a test authentication instead of mocking
        authentication = new TestAuthentication(userDetails, userDetails.getAuthorities());
    }

    @Test
    void authenticateUser_Success() throws Exception {
        when(authService.authenticateUser(any(LoginRequest.class))).thenReturn(jwtResponse);

        mockMvc.perform(post("/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("access_token"))
                .andExpect(jsonPath("$.refreshToken").value("refresh_token"))
                .andExpect(jsonPath("$.username").value("testuser"));

        verify(authService).authenticateUser(any(LoginRequest.class));
    }

    @Test
    void registerUser_Success() throws Exception {
        when(authService.registerUser(any(SignupRequest.class)))
                .thenReturn(new MessageResponse("User registered successfully!"));

        mockMvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered successfully!"));

        verify(authService).registerUser(any(SignupRequest.class));
    }

    @Test
    void refreshToken_Success() throws Exception {
        when(authService.refreshToken(any(TokenRefreshRequest.class))).thenReturn(tokenRefreshResponse);

        mockMvc.perform(post("/auth/refreshtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(tokenRefreshRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("new_access_token"))
                .andExpect(jsonPath("$.refreshToken").value("new_refresh_token"))
                .andExpect(jsonPath("$.tokenType").value("Bearer"));

        verify(authService).refreshToken(any(TokenRefreshRequest.class));
    }

    @Test
    void refreshToken_InvalidToken() throws Exception {
        when(authService.refreshToken(any(TokenRefreshRequest.class)))
                .thenThrow(new TokenRefreshException("refresh_token", "Refresh token is not in database!"));

        mockMvc.perform(post("/auth/refreshtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(tokenRefreshRequest)))
                .andExpect(status().isForbidden())
                .andExpect(result -> {
                    String content = result.getResponse().getContentAsString();
                    assertTrue(content.contains("Refresh token is not in database"));
                });

        verify(authService).refreshToken(any(TokenRefreshRequest.class));
    }

    @Test
    void refreshToken_InvokedToken() throws Exception {
        when(authService.refreshToken(any(TokenRefreshRequest.class)))
                .thenThrow(new TokenRefreshException("refresh_token", "Refresh token was already used. Please make a new signin request"));

        mockMvc.perform(post("/auth/refreshtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(tokenRefreshRequest)))
                .andExpect(status().isForbidden())
                .andExpect(result -> {
                    String content = result.getResponse().getContentAsString();
                    assertTrue(content.contains("Refresh token was already used"));
                });

        verify(authService).refreshToken(any(TokenRefreshRequest.class));
    }

    @Test
    void refreshToken_ExpiredToken() throws Exception {
        when(authService.refreshToken(any(TokenRefreshRequest.class)))
                .thenThrow(new TokenRefreshException("refresh_token", "Refresh token was expired. Please make a new signin request"));

        mockMvc.perform(post("/auth/refreshtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(tokenRefreshRequest)))
                .andExpect(status().isForbidden())
                .andExpect(result -> {
                    String content = result.getResponse().getContentAsString();
                    assertTrue(content.contains("Refresh token was expired"));
                });

        verify(authService).refreshToken(any(TokenRefreshRequest.class));
    }

    @Test
    void logoutUser_Success() throws Exception {
        // Create a SecurityContext with our Authentication
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(authentication);
        SecurityContextHolder.setContext(securityContext);

        try {
            // Mock service response
            when(authService.logoutUser(eq(1L))).thenReturn(new MessageResponse("Log out successful!"));

            // Perform request
            mockMvc.perform(post("/auth/logout"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message").value("Log out successful!"));

            // Verify service was called
            verify(authService).logoutUser(eq(1L));
        } finally {
            // Always clear the security context after the test
            SecurityContextHolder.clearContext();
        }
    }
}
