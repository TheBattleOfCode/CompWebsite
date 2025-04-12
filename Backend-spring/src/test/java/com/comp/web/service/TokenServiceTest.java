package com.comp.web.service;

import com.comp.web.exception.TokenRefreshException;
import com.comp.web.model.entity.Token;
import com.comp.web.model.entity.User;
import com.comp.web.repository.TokenRepository;
import com.comp.web.repository.UserRepository;
import com.comp.web.service.impl.TokenServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TokenServiceTest {

    @Mock
    private TokenRepository tokenRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TokenServiceImpl tokenService;

    private User user;
    private Token token;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(tokenService, "accessTokenDurationMs", 900000L); // 15 minutes
        ReflectionTestUtils.setField(tokenService, "refreshTokenDurationMs", 86400000L); // 24 hours

        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPassword("password");

        token = new Token();
        token.setId(1L);
        token.setUser(user);
        token.setAccessToken("access_token");
        token.setRefreshToken("refresh_token");
        token.setAccessTokenExpiryDate(Instant.now().plusMillis(900000L));
        token.setRefreshTokenExpiryDate(Instant.now().plusMillis(86400000L));
        token.setInvoked(false);
    }

    @Test
    void findByAccessToken_Success() {
        when(tokenRepository.findByAccessToken("access_token")).thenReturn(Optional.of(token));

        Optional<Token> result = tokenService.findByAccessToken("access_token");

        assertTrue(result.isPresent());
        assertEquals(token, result.get());
        verify(tokenRepository).findByAccessToken("access_token");
    }

    @Test
    void findByRefreshToken_Success() {
        when(tokenRepository.findByRefreshToken("refresh_token")).thenReturn(Optional.of(token));

        Optional<Token> result = tokenService.findByRefreshToken("refresh_token");

        assertTrue(result.isPresent());
        assertEquals(token, result.get());
        verify(tokenRepository).findByRefreshToken("refresh_token");
    }

    @Test
    void createToken_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(tokenRepository.save(any(Token.class))).thenReturn(token);

        Token result = tokenService.createToken(1L, "access_token", "refresh_token");

        assertNotNull(result);
        assertEquals(token, result);
        verify(userRepository).findById(1L);
        verify(tokenRepository).save(any(Token.class));
    }

    @Test
    void verifyRefreshTokenExpirationAndInvocation_Success() {
        Token result = tokenService.verifyRefreshTokenExpirationAndInvocation(token);

        assertNotNull(result);
        assertEquals(token, result);
    }

    @Test
    void verifyRefreshTokenExpirationAndInvocation_TokenInvoked() {
        token.setInvoked(true);

        assertThrows(TokenRefreshException.class, () -> {
            tokenService.verifyRefreshTokenExpirationAndInvocation(token);
        });
    }

    @Test
    void verifyRefreshTokenExpirationAndInvocation_TokenExpired() {
        token.setRefreshTokenExpiryDate(Instant.now().minusMillis(1000L));

        assertThrows(TokenRefreshException.class, () -> {
            tokenService.verifyRefreshTokenExpirationAndInvocation(token);
        });
        verify(tokenRepository).delete(token);
    }

    @Test
    void markAsInvoked_Success() {
        when(tokenRepository.save(token)).thenReturn(token);

        Token result = tokenService.markAsInvoked(token);

        assertNotNull(result);
        assertTrue(result.isInvoked());
        verify(tokenRepository).save(token);
    }

    @Test
    void deleteByUser_Success() {
        when(tokenRepository.deleteByUser(user)).thenReturn(1);

        int result = tokenService.deleteByUser(user);

        assertEquals(1, result);
        verify(tokenRepository).deleteByUser(user);
    }
}
