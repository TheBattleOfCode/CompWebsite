package com.comp.web.service.impl;

import com.comp.web.exception.TokenRefreshException;
import com.comp.web.model.entity.Token;
import com.comp.web.model.entity.User;
import com.comp.web.repository.TokenRepository;
import com.comp.web.repository.UserRepository;
import com.comp.web.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Service
public class TokenServiceImpl implements TokenService {

    @Value("${app.jwt.expiration}")
    private Long accessTokenDurationMs;

    @Value("${app.jwt.refresh-expiration}")
    private Long refreshTokenDurationMs;

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Optional<Token> findByAccessToken(String accessToken) {
        return tokenRepository.findByAccessToken(accessToken);
    }

    @Override
    public Optional<Token> findByRefreshToken(String refreshToken) {
        return tokenRepository.findByRefreshToken(refreshToken);
    }

    @Override
    @Transactional
    public Token createToken(Long userId, String accessToken, String refreshToken) {
        // First, check if there's an existing token with the same access token and mark it as invoked
        tokenRepository.findByAccessToken(accessToken).ifPresent(existingToken -> {
            existingToken.setInvoked(true);
            tokenRepository.save(existingToken);
        });

        // Then create a new token
        Token token = new Token();

        token.setUser(userRepository.findById(userId).orElseThrow(
                () -> new RuntimeException("User not found with id: " + userId)));
        token.setAccessToken(accessToken);
        token.setRefreshToken(refreshToken);
        token.setAccessTokenExpiryDate(Instant.now().plusMillis(accessTokenDurationMs));
        token.setRefreshTokenExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
        token.setInvoked(false);

        return tokenRepository.save(token);
    }

    @Override
    public Token verifyRefreshTokenExpirationAndInvocation(Token token) {
        // Check if the token has been invoked
        if (token.isInvoked()) {
            throw new TokenRefreshException(token.getRefreshToken(),
                    "Refresh token was already used. Please make a new signin request");
        }

        // Check if the refresh token has expired
        if (token.getRefreshTokenExpiryDate().compareTo(Instant.now()) < 0) {
            tokenRepository.delete(token);
            throw new TokenRefreshException(token.getRefreshToken(),
                    "Refresh token was expired. Please make a new signin request");
        }

        return token;
    }

    @Override
    @Transactional
    public Token markAsInvoked(Token token) {
        token.setInvoked(true);
        return tokenRepository.save(token);
    }

    @Override
    @Transactional
    public int deleteByUser(User user) {
        return tokenRepository.deleteByUser(user);
    }
}
