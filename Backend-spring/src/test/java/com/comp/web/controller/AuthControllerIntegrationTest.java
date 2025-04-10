package com.comp.web.controller;

import com.comp.web.model.dto.request.LoginRequest;
import com.comp.web.model.dto.request.SignupRequest;
import com.comp.web.model.dto.response.JwtResponse;
import com.comp.web.model.dto.response.MessageResponse;
import com.comp.web.model.entity.ERole;
import com.comp.web.model.entity.Role;
import com.comp.web.repository.RoleRepository;
import com.comp.web.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        // Clear database
        userRepository.deleteAll();
        
        // Ensure roles exist
        if (roleRepository.count() == 0) {
            roleRepository.save(new Role(ERole.ROLE_USER));
            roleRepository.save(new Role(ERole.ROLE_MODERATOR));
            roleRepository.save(new Role(ERole.ROLE_ADMIN));
        }
    }

    @Test
    void registerAndLoginUser() throws Exception {
        // Register a new user
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("testuser");
        signupRequest.setEmail("test@example.com");
        signupRequest.setPassword("password123");
        Set<String> roles = new HashSet<>();
        roles.add("user");
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
        loginRequest.setUsername("testuser");
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
        assertEquals("testuser", jwtResponse.getUsername());
        assertEquals("test@example.com", jwtResponse.getEmail());
        assertTrue(jwtResponse.getRoles().contains("ROLE_USER"));
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
}
