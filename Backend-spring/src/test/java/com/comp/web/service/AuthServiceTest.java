package com.comp.web.service;

import com.comp.web.model.dto.request.LoginRequest;
import com.comp.web.model.dto.request.SignupRequest;
import com.comp.web.model.dto.response.JwtResponse;
import com.comp.web.model.dto.response.MessageResponse;
import com.comp.web.model.entity.ERole;
import com.comp.web.model.entity.RefreshToken;
import com.comp.web.model.entity.Role;
import com.comp.web.model.entity.User;
import com.comp.web.repository.RoleRepository;
import com.comp.web.repository.UserRepository;
import com.comp.web.security.jwt.JwtUtils;
import com.comp.web.service.impl.AuthServiceImpl;
import com.comp.web.service.impl.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.doReturn;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @BeforeEach
    void setUpMockito() {
        MockitoAnnotations.openMocks(this);
        Mockito.lenient().when(jwtUtils.generateJwtToken(any(Authentication.class))).thenReturn("jwt_token");
    }

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder encoder;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private RefreshTokenService refreshTokenService;

    @InjectMocks
    private AuthServiceImpl authService;

    private User user;
    private Role role;
    private LoginRequest loginRequest;
    private SignupRequest signupRequest;
    private Authentication authentication;
    private UserDetailsImpl userDetails;
    private RefreshToken refreshToken;

    @BeforeEach
    void setUp() {
        // Setup test data
        role = new Role(1, ERole.ROLE_USER);

        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPassword("encoded_password");
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

        authentication = mock(Authentication.class);
        lenient().when(authentication.getPrincipal()).thenReturn(userDetails);

        refreshToken = new RefreshToken();
        refreshToken.setId(1L);
        refreshToken.setUser(user);
        refreshToken.setToken("refresh_token");
    }

    @Test
    void authenticateUser_Success() {
        // Arrange
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        // JwtUtils mock is already set up in setUp()
        when(refreshTokenService.createRefreshToken(1L)).thenReturn(refreshToken);

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
        verify(jwtUtils).generateJwtToken(authentication);
        verify(refreshTokenService).createRefreshToken(1L);
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
}
