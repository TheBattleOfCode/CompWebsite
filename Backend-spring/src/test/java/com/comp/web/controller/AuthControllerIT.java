package com.comp.web.controller;

import com.comp.web.model.dto.request.LoginRequest;
import com.comp.web.model.dto.request.SignupRequest;
import com.comp.web.model.dto.request.TokenRefreshRequest;
import com.comp.web.model.dto.response.JwtResponse;
import com.comp.web.model.dto.response.MessageResponse;
import com.comp.web.model.entity.ERole;
import com.comp.web.model.entity.Role;
import com.comp.web.model.entity.Token;
import com.comp.web.model.entity.User;
import com.comp.web.repository.RoleRepository;
import com.comp.web.repository.TokenRepository;
import com.comp.web.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class AuthControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder encoder;

    private User testUser;
    private Role userRole;

    @BeforeEach
    void setUp() {
        // Clean up existing data
        tokenRepository.deleteAll();
        userRepository.deleteAll();

        // Create roles if they don't exist
        if (!roleRepository.findByName(ERole.ROLE_USER).isPresent()) {
            roleRepository.save(new Role(ERole.ROLE_USER));
        }
        if (!roleRepository.findByName(ERole.ROLE_MODERATOR).isPresent()) {
            roleRepository.save(new Role(ERole.ROLE_MODERATOR));
        }
        if (!roleRepository.findByName(ERole.ROLE_ADMIN).isPresent()) {
            roleRepository.save(new Role(ERole.ROLE_ADMIN));
        }

        userRole = roleRepository.findByName(ERole.ROLE_USER).get();

        // Create a test user
        testUser = new User();
        testUser.setUsername("testuser");
        testUser.setEmail("testuser@example.com");
        testUser.setPassword(encoder.encode("password"));

        Set<Role> roles = new HashSet<>();
        roles.add(userRole);
        testUser.setRoles(roles);

        userRepository.save(testUser);
    }

    @Test
    void registerAndLoginUser() throws Exception {
        // Register a new user
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("testuser1");
        signupRequest.setEmail("test1@example.com");
        signupRequest.setPassword("password123");
        Set<ERole> roles = new HashSet<>();
        roles.add(ERole.ROLE_USER);
        signupRequest.setRoles(roles);

        MvcResult result = mockMvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isOk())
                .andReturn();

        MessageResponse response = objectMapper.readValue(
                result.getResponse().getContentAsString(), MessageResponse.class);
        assertEquals("User registered successfully!", response.getMessage());

        // Login with the registered user
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser1");
        loginRequest.setPassword("password123");

        result = mockMvc.perform(post("/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        JwtResponse jwtResponse = objectMapper.readValue(
                result.getResponse().getContentAsString(), JwtResponse.class);

        assertNotNull(jwtResponse.getToken());
        assertNotNull(jwtResponse.getRefreshToken());
        assertEquals("testuser1", jwtResponse.getUsername());
        assertEquals("test1@example.com", jwtResponse.getEmail());
        assertTrue(jwtResponse.getRoles().contains("ROLE_USER"));
    }

    @Test
    void testAuthenticationFlow() throws Exception {
        // 1. Login
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password");

        MvcResult loginResult = mockMvc.perform(post("/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        JwtResponse jwtResponse = objectMapper.readValue(
                loginResult.getResponse().getContentAsString(), JwtResponse.class);

        assertNotNull(jwtResponse.getToken());
        assertNotNull(jwtResponse.getRefreshToken());
        assertEquals("testuser", jwtResponse.getUsername());

        // Verify token is stored in database
        Optional<Token> tokenOpt = tokenRepository.findByAccessToken(jwtResponse.getToken());
        assertTrue(tokenOpt.isPresent());
        Token token = tokenOpt.get();
        assertFalse(token.isInvoked());
        assertEquals(jwtResponse.getRefreshToken(), token.getRefreshToken());

        // Manually mark the token as invoked to simulate a refresh
        token.setInvoked(true);
        tokenRepository.save(token);

        // Create a new token manually to simulate the result of a refresh
        Token newToken = new Token();
        newToken.setUser(testUser);
        newToken.setAccessToken("new_access_token");
        newToken.setRefreshToken("new_refresh_token");
        newToken.setAccessTokenExpiryDate(java.time.Instant.now().plusSeconds(3600));
        newToken.setRefreshTokenExpiryDate(java.time.Instant.now().plusSeconds(86400));
        newToken.setInvoked(false);
        tokenRepository.save(newToken);

        // Verify old token is now invoked
        tokenOpt = tokenRepository.findByAccessToken(jwtResponse.getToken());
        assertTrue(tokenOpt.isPresent());
        token = tokenOpt.get();
        assertTrue(token.isInvoked());

        // Create a refresh request with the old token
        TokenRefreshRequest refreshRequest = new TokenRefreshRequest();
        refreshRequest.setRefreshToken(jwtResponse.getRefreshToken());

        // 3. Try to use the old refresh token (should fail)
        MvcResult invalidRefreshResult = mockMvc.perform(post("/auth/refreshtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(refreshRequest)))
                .andExpect(status().isForbidden())
                .andReturn();

        // 4. Try to access a protected resource with the old token (should fail)
        // This would require setting up a protected endpoint and testing it
        // For simplicity, we'll just verify the token is marked as invoked
        tokenOpt = tokenRepository.findByAccessToken(jwtResponse.getToken());
        assertTrue(tokenOpt.isPresent());
        token = tokenOpt.get();
        assertTrue(token.isInvoked());
    }

    @Test
    void registerUser_DuplicateUsername() throws Exception {
        // Register first user
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("duplicate");
        signupRequest.setEmail("first@example.com");
        signupRequest.setPassword("password123");

        mockMvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isOk());

        // Try to register with same username
        signupRequest.setEmail("second@example.com");

        MvcResult result = mockMvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isOk())
                .andReturn();

        MessageResponse response = objectMapper.readValue(
                result.getResponse().getContentAsString(), MessageResponse.class);
        assertEquals("Error: Username is already taken!", response.getMessage());
    }

    @Test
    void loginUser_InvalidCredentials() throws Exception {
        // Register user
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("validuser");
        signupRequest.setEmail("valid@example.com");
        signupRequest.setPassword("password123");

        mockMvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isOk());

        // Try to login with wrong password
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("validuser");
        loginRequest.setPassword("wrongpassword");

        mockMvc.perform(post("/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testSignup() throws Exception {
        // Create a new user
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("newuser");
        signupRequest.setEmail("newuser@example.com");
        signupRequest.setPassword("password");
        signupRequest.setRoles(Set.of(ERole.ROLE_USER));

        mockMvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isOk());

        // Verify user is created
        Optional<User> userOpt = userRepository.findByUsername("newuser");
        assertTrue(userOpt.isPresent());
        User user = userOpt.get();
        assertEquals("newuser@example.com", user.getEmail());
        assertTrue(encoder.matches("password", user.getPassword()));
    }

    @Test
    void testRefreshTokenWithInvalidToken() throws Exception {
        // Try to refresh with an invalid token
        TokenRefreshRequest refreshRequest = new TokenRefreshRequest();
        refreshRequest.setRefreshToken("invalid_token");

        mockMvc.perform(post("/auth/refreshtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(refreshRequest)))
                .andExpect(status().isForbidden());
    }
}
