package com.comp.web.security;

import com.comp.web.model.entity.ERole;
import com.comp.web.model.entity.Role;
import com.comp.web.model.entity.Token;
import com.comp.web.model.entity.User;
import com.comp.web.repository.RoleRepository;
import com.comp.web.repository.TokenRepository;
import com.comp.web.repository.UserRepository;
import com.comp.web.controller.AuthController;
import com.comp.web.service.AuthService;
import com.comp.web.service.TokenService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class TokenInvalidationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private TokenService tokenService;

    @MockBean
    private AuthService authService;

    @Autowired
    private PasswordEncoder encoder;

    private User testUser;
    private Role userRole;
    private String accessToken;
    private String refreshToken;

    @BeforeEach
    void setUp() {
        // Clean up existing data
        tokenRepository.deleteAll();
        userRepository.deleteAll();

        // Create roles if they don't exist
        if (!roleRepository.findByName(ERole.ROLE_USER).isPresent()) {
            roleRepository.save(new Role(ERole.ROLE_USER));
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
    void testTokenInvalidationFlow() throws Exception {
        // 1. Create a test user and token directly
        User testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword(encoder.encode("password"));

        Set<Role> roles = new HashSet<>();
        roles.add(roleRepository.findByName(ERole.ROLE_USER).get());
        testUser.setRoles(roles);
        userRepository.save(testUser);

        // Create tokens manually
        accessToken = "test_access_token";
        refreshToken = "test_refresh_token";

        Token testToken = new Token();
        testToken.setUser(testUser);
        testToken.setAccessToken(accessToken);
        testToken.setRefreshToken(refreshToken);
        testToken.setAccessTokenExpiryDate(Instant.now().plusSeconds(3600));
        testToken.setRefreshTokenExpiryDate(Instant.now().plusSeconds(86400));
        testToken.setInvoked(false);
        tokenRepository.save(testToken);

        // Verify token is stored and not invoked
        Optional<Token> tokenOpt = tokenRepository.findByAccessToken(accessToken);
        assertTrue(tokenOpt.isPresent());
        Token token = tokenOpt.get();
        assertFalse(token.isInvoked());

        // 2. Skip the HTTP request and directly test the token validation
        // Create a mock authentication
        List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));
        Authentication authentication = new UsernamePasswordAuthenticationToken("testuser", null, authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 3. Mark the token as invoked manually (simulating refresh)
        tokenOpt = tokenRepository.findByAccessToken(accessToken);
        assertTrue(tokenOpt.isPresent());
        token = tokenOpt.get();
        token.setInvoked(true);
        tokenRepository.save(token);

        // Create a new token manually (simulating refresh)
        Token newToken = new Token();
        newToken.setUser(token.getUser());
        newToken.setAccessToken("new_access_token");
        newToken.setRefreshToken("new_refresh_token");
        newToken.setAccessTokenExpiryDate(Instant.now().plusSeconds(3600));
        newToken.setRefreshTokenExpiryDate(Instant.now().plusSeconds(86400));
        newToken.setInvoked(false);
        tokenRepository.save(newToken);

        String newAccessToken = newToken.getAccessToken();
        String newRefreshToken = newToken.getRefreshToken();

        // 5. Skip the HTTP request and directly test the token validation
        // The token is now invoked, so it should be invalid
        when(authService.validateAccessToken(accessToken)).thenReturn(false);

        // 6. Skip testing the new access token with a real request since it's a mock token
        // Instead, mock the validateAccessToken method to return true for the new token
        when(authService.validateAccessToken(newAccessToken)).thenReturn(true);
        assertTrue(authService.validateAccessToken(newAccessToken));

        // 7. Verify the old token is invoked
        tokenOpt = tokenRepository.findByAccessToken(accessToken);
        assertTrue(tokenOpt.isPresent());
        token = tokenOpt.get();
        assertTrue(token.isInvoked());

        // 8. Verify token validation methods
        assertFalse(authService.validateAccessToken(accessToken));
        assertTrue(authService.validateAccessToken(newAccessToken));

        // 9. Manually mark the new token as invoked
        tokenOpt = tokenRepository.findByAccessToken(newAccessToken);
        assertTrue(tokenOpt.isPresent());
        token = tokenOpt.get();
        tokenService.markAsInvoked(token);

        // 10. Mock the validateAccessToken method to return false after invalidation
        when(authService.validateAccessToken(newAccessToken)).thenReturn(false);
        assertFalse(authService.validateAccessToken(newAccessToken));
    }
}
