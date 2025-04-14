package com.comp.web.security.jwt;

import com.comp.web.model.entity.Token;
import com.comp.web.service.TokenService;
import com.comp.web.service.UserDetailsService;
import com.comp.web.service.impl.UserDetailsImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthTokenFilterTest {

    @Mock
    private JwtUtilsInterface jwtUtils;

    @Mock
    private UserDetailsService userDetailsService;

    @Mock
    private TokenService tokenService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @InjectMocks
    private AuthTokenFilter authTokenFilter;

    private Token token;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.clearContext();

        token = new Token();
        token.setId(1L);
        token.setAccessToken("valid_token");
        token.setRefreshToken("refresh_token");
        token.setAccessTokenExpiryDate(Instant.now().plusSeconds(3600));
        token.setRefreshTokenExpiryDate(Instant.now().plusSeconds(86400));
        token.setInvoked(false);

        List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));
        userDetails = new UserDetailsImpl(1L, "testuser", "test@example.com", "password", authorities);
    }

    @Test
    void doFilterInternal_ValidToken_Success() throws ServletException, IOException {
        // Arrange
        when(request.getHeader("Authorization")).thenReturn("Bearer valid_token");
        when(jwtUtils.validateJwtToken("valid_token")).thenReturn(true);
        when(jwtUtils.getUserNameFromJwtToken("valid_token")).thenReturn("testuser");
        when(userDetailsService.loadUserByUsername("testuser")).thenReturn(userDetails);
        when(tokenService.findByAccessToken("valid_token")).thenReturn(Optional.of(token));

        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert
        assertNotNull(SecurityContextHolder.getContext().getAuthentication());
        assertEquals(userDetails, SecurityContextHolder.getContext().getAuthentication().getPrincipal());
        verify(filterChain).doFilter(request, response);
    }

    @Test
    void doFilterInternal_InvalidToken_NoAuthentication() throws ServletException, IOException {
        // Arrange
        when(request.getHeader("Authorization")).thenReturn("Bearer invalid_token");
        when(jwtUtils.validateJwtToken("invalid_token")).thenReturn(false);

        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert
        assertNull(SecurityContextHolder.getContext().getAuthentication());
        verify(filterChain).doFilter(request, response);
    }

    @Test
    void doFilterInternal_InvokedToken_NoAuthentication() throws ServletException, IOException {
        // Arrange
        token.setInvoked(true);
        when(request.getHeader("Authorization")).thenReturn("Bearer valid_token");
        when(jwtUtils.validateJwtToken("valid_token")).thenReturn(true);
        when(tokenService.findByAccessToken("valid_token")).thenReturn(Optional.of(token));

        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert
        assertNull(SecurityContextHolder.getContext().getAuthentication());
        verify(filterChain).doFilter(request, response);
    }

    @Test
    void doFilterInternal_ExpiredToken_NoAuthentication() throws ServletException, IOException {
        // Arrange
        token.setAccessTokenExpiryDate(Instant.now().minusSeconds(3600));
        when(request.getHeader("Authorization")).thenReturn("Bearer valid_token");
        when(jwtUtils.validateJwtToken("valid_token")).thenReturn(true);
        when(tokenService.findByAccessToken("valid_token")).thenReturn(Optional.of(token));

        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert
        assertNull(SecurityContextHolder.getContext().getAuthentication());
        verify(filterChain).doFilter(request, response);
    }

    @Test
    void doFilterInternal_NoToken_NoAuthentication() throws ServletException, IOException {
        // Arrange
        when(request.getHeader("Authorization")).thenReturn(null);

        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert
        assertNull(SecurityContextHolder.getContext().getAuthentication());
        verify(filterChain).doFilter(request, response);
    }
}
