package com.comp.web.service;

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
import com.comp.web.repository.RoleRepository;
import com.comp.web.repository.UserRepository;
import com.comp.web.security.jwt.JwtUtilsInterface;
import com.comp.web.service.impl.AuthServiceImpl;
import com.comp.web.service.impl.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceImplTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder encoder;

    @Mock
    private JwtUtilsInterface jwtUtils;

    @Mock
    private TokenService tokenService;

    @InjectMocks
    private AuthServiceImpl authService;

    private User user;
    private Role role;
    private LoginRequest loginRequest;
    private SignupRequest signupRequest;
    private Authentication authentication;
    private UserDetailsImpl userDetails;
    private Token token;
    private TokenRefreshRequest tokenRefreshRequest;

    @BeforeEach
    void setUp() {
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

        loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password");

        signupRequest = new SignupRequest();
        signupRequest.setUsername("newuser");
        signupRequest.setEmail("newuser@example.com");
        signupRequest.setPassword("password");
        signupRequest.setRoles(Set.of(ERole.ROLE_USER));

        List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));
        userDetails = new UserDetailsImpl(1L, "testuser", "test@example.com", "encoded_password", authorities);

        // Create a test authentication instead of mocking
        authentication = new TestAuthentication(userDetails, userDetails.getAuthorities());

        token = new Token();
        token.setId(1L);
        token.setUser(user);
        token.setAccessToken("jwt_token");
        token.setRefreshToken("refresh_token");
        token.setRefreshTokenExpiryDate(Instant.now().plusSeconds(3600));
        token.setAccessTokenExpiryDate(Instant.now().plusSeconds(1800));
        token.setInvoked(false);

        tokenRefreshRequest = new TokenRefreshRequest();
        tokenRefreshRequest.setRefreshToken("refresh_token");
    }

    @Test
    void authenticateUser_Success() {
        // Arrange
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(jwtUtils.generateJwtToken(any(Authentication.class))).thenReturn("jwt_token");
        when(tokenService.createToken(eq(1L), anyString(), anyString())).thenReturn(token);

        // Act
        JwtResponse response = authService.authenticateUser(loginRequest);

        // Assert
        assertNotNull(response);
        assertEquals("jwt_token", response.getToken());
        assertEquals("refresh_token", response.getRefreshToken());
        assertEquals(1L, response.getId());
        assertEquals("testuser", response.getUsername());
        assertEquals("test@example.com", response.getEmail());
        assertEquals(1, response.getRoles().size());
        assertEquals("ROLE_USER", response.getRoles().get(0));

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtUtils).generateJwtToken(any(Authentication.class));
        verify(tokenService).createToken(eq(1L), anyString(), anyString());
    }

    @Test
    void registerUser_Success() {
        // Arrange
        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("newuser@example.com")).thenReturn(false);
        when(encoder.encode("password")).thenReturn("encoded_password");
        when(roleRepository.findByName(ERole.ROLE_USER)).thenReturn(Optional.of(role));

        // Act
        MessageResponse response = authService.registerUser(signupRequest);

        // Assert
        assertNotNull(response);
        assertEquals("User registered successfully!", response.getMessage());

        verify(userRepository).existsByUsername("newuser");
        verify(userRepository).existsByEmail("newuser@example.com");
        verify(encoder).encode("password");
        verify(roleRepository).findByName(ERole.ROLE_USER);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void registerUser_UsernameExists() {
        // Arrange
        when(userRepository.existsByUsername("newuser")).thenReturn(true);

        // Act
        MessageResponse response = authService.registerUser(signupRequest);

        // Assert
        assertNotNull(response);
        assertEquals("Error: Username is already taken!", response.getMessage());

        verify(userRepository).existsByUsername("newuser");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void registerUser_EmailExists() {
        // Arrange
        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("newuser@example.com")).thenReturn(true);

        // Act
        MessageResponse response = authService.registerUser(signupRequest);

        // Assert
        assertNotNull(response);
        assertEquals("Error: Email is already in use!", response.getMessage());

        verify(userRepository).existsByUsername("newuser");
        verify(userRepository).existsByEmail("newuser@example.com");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void refreshToken_Success() {
        // Arrange
        Token newToken = new Token();
        newToken.setRefreshToken("new_refresh_token");
        newToken.setAccessToken("new_jwt_token");
        newToken.setUser(user);
        newToken.setRefreshTokenExpiryDate(Instant.now().plusSeconds(3600));
        newToken.setAccessTokenExpiryDate(Instant.now().plusSeconds(1800));

        when(tokenService.findByRefreshToken("refresh_token")).thenReturn(Optional.of(token));
        when(tokenService.verifyRefreshTokenExpirationAndInvocation(token)).thenReturn(token);
        when(tokenService.markAsInvoked(token)).thenReturn(token);
        when(jwtUtils.generateTokenFromUsername(anyString())).thenReturn("new_jwt_token");
        when(tokenService.createToken(eq(1L), anyString(), anyString())).thenReturn(newToken);

        // Act
        TokenRefreshResponse response = authService.refreshToken(tokenRefreshRequest);

        // Assert
        assertNotNull(response);
        assertEquals("new_jwt_token", response.getAccessToken());
        assertEquals("new_refresh_token", response.getRefreshToken());
        assertEquals("Bearer", response.getTokenType());

        verify(tokenService).findByRefreshToken("refresh_token");
        verify(tokenService).verifyRefreshTokenExpirationAndInvocation(token);
        verify(tokenService).markAsInvoked(token);
        verify(jwtUtils).generateTokenFromUsername(anyString());
        verify(tokenService).createToken(eq(1L), anyString(), anyString());
    }

    @Test
    void refreshToken_InvalidRefreshToken() {
        // Arrange
        when(tokenService.findByRefreshToken("refresh_token")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(TokenRefreshException.class, () -> {
            authService.refreshToken(tokenRefreshRequest);
        });

        verify(tokenService).findByRefreshToken("refresh_token");
        verify(tokenService, never()).verifyRefreshTokenExpirationAndInvocation(any(Token.class));
    }

    @Test
    void refreshToken_InvokedRefreshToken() {
        // Arrange
        when(tokenService.findByRefreshToken("refresh_token")).thenReturn(Optional.of(token));
        when(tokenService.verifyRefreshTokenExpirationAndInvocation(token))
                .thenThrow(new TokenRefreshException("refresh_token", "Refresh token was already used"));

        // Act & Assert
        assertThrows(TokenRefreshException.class, () -> {
            authService.refreshToken(tokenRefreshRequest);
        });

        verify(tokenService).findByRefreshToken("refresh_token");
        verify(tokenService).verifyRefreshTokenExpirationAndInvocation(token);
        verify(tokenService, never()).markAsInvoked(any(Token.class));
    }

    @Test
    void logoutUser_Success() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(tokenService.deleteByUser(user)).thenReturn(1);

        // Act
        MessageResponse response = authService.logoutUser(1L);

        // Assert
        assertNotNull(response);
        assertEquals("Log out successful!", response.getMessage());

        verify(userRepository).findById(1L);
        verify(tokenService).deleteByUser(user);
    }

    @Test
    void logoutUser_UserNotFound() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            authService.logoutUser(1L);
        });

        verify(userRepository).findById(1L);
        verify(tokenService, never()).deleteByUser(any(User.class));
    }

    @Test
    void validateAccessToken_ValidToken() {
        // Arrange
        when(jwtUtils.validateJwtToken("jwt_token")).thenReturn(true);
        when(tokenService.findByAccessToken("jwt_token")).thenReturn(Optional.of(token));

        // Act
        boolean result = authService.validateAccessToken("jwt_token");

        // Assert
        assertTrue(result);
        verify(jwtUtils).validateJwtToken("jwt_token");
        verify(tokenService).findByAccessToken("jwt_token");
    }

    @Test
    void validateAccessToken_InvalidJwtToken() {
        // Arrange
        when(jwtUtils.validateJwtToken("invalid_token")).thenReturn(false);

        // Act
        boolean result = authService.validateAccessToken("invalid_token");

        // Assert
        assertFalse(result);
        verify(jwtUtils).validateJwtToken("invalid_token");
        verify(tokenService, never()).findByAccessToken(anyString());
    }

    @Test
    void validateAccessToken_InvokedToken() {
        // Arrange
        token.setInvoked(true);
        when(jwtUtils.validateJwtToken("jwt_token")).thenReturn(true);
        when(tokenService.findByAccessToken("jwt_token")).thenReturn(Optional.of(token));

        // Act
        boolean result = authService.validateAccessToken("jwt_token");

        // Assert
        assertFalse(result);
        verify(jwtUtils).validateJwtToken("jwt_token");
        verify(tokenService).findByAccessToken("jwt_token");
    }

    @Test
    void validateAccessToken_ExpiredToken() {
        // Arrange
        token.setAccessTokenExpiryDate(Instant.now().minusSeconds(1800));
        when(jwtUtils.validateJwtToken("jwt_token")).thenReturn(true);
        when(tokenService.findByAccessToken("jwt_token")).thenReturn(Optional.of(token));

        // Act
        boolean result = authService.validateAccessToken("jwt_token");

        // Assert
        assertFalse(result);
        verify(jwtUtils).validateJwtToken("jwt_token");
        verify(tokenService).findByAccessToken("jwt_token");
    }

    @Test
    void validateAccessToken_TokenNotFound() {
        // Arrange
        when(jwtUtils.validateJwtToken("jwt_token")).thenReturn(true);
        when(tokenService.findByAccessToken("jwt_token")).thenReturn(Optional.empty());

        // Act
        boolean result = authService.validateAccessToken("jwt_token");

        // Assert
        assertFalse(result);
        verify(jwtUtils).validateJwtToken("jwt_token");
        verify(tokenService).findByAccessToken("jwt_token");
    }
}
