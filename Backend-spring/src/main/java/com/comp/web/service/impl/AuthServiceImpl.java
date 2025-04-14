package com.comp.web.service.impl;

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
import com.comp.web.service.AuthService;
import com.comp.web.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthServiceImpl implements AuthService {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtilsInterface jwtUtils;

    @Autowired
    private TokenService tokenService;

    @Override
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        String jwt = jwtUtils.generateJwtToken(authentication);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        // Generate a refresh token
        String refreshTokenStr = java.util.UUID.randomUUID().toString();

        // Create a token with both access and refresh tokens
        Token token = tokenService.createToken(userDetails.getId(), jwt, refreshTokenStr);

        return JwtResponse.builder()
                .token(jwt)
                .refreshToken(token.getRefreshToken())
                .id(userDetails.getId())
                .username(userDetails.getUsername())
                .email(userDetails.getEmail())
                .roles(roles)
                .build();
    }

    @Override
    @Transactional
    public MessageResponse registerUser(SignupRequest signupRequest) {
        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            return new MessageResponse("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            return new MessageResponse("Error: Email is already in use!");
        }

        // Create new user's account
        User user = new User(
                signupRequest.getUsername(),
                signupRequest.getEmail(),
                encoder.encode(signupRequest.getPassword()));

        Set<ERole> strRoles = signupRequest.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case ROLE_ADMIN:
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);
                        break;
                    case ROLE_MODERATOR:
                        Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);
                        break;
                    default:
                        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return new MessageResponse("User registered successfully!");
    }

    @Override
    public TokenRefreshResponse refreshToken(TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return tokenService.findByRefreshToken(requestRefreshToken)
                .map(tokenService::verifyRefreshTokenExpirationAndInvocation)
                .map(token -> {
                    // Mark the current token as invoked
                    tokenService.markAsInvoked(token);

                    // Generate new tokens
                    String newAccessToken = jwtUtils.generateTokenFromUsername(token.getUser().getUsername());
                    String newRefreshToken = java.util.UUID.randomUUID().toString();

                    // Create a new token with both access and refresh tokens
                    Token newToken = tokenService.createToken(
                            token.getUser().getId(), newAccessToken, newRefreshToken);

                    return new TokenRefreshResponse(newAccessToken, newToken.getRefreshToken(), "Bearer");
                })
                .orElseThrow(() -> new TokenRefreshException(requestRefreshToken,
                        "Refresh token is not in database!"));
    }

    @Override
    @Transactional
    public MessageResponse logoutUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        tokenService.deleteByUser(user);
        return new MessageResponse("Log out successful!");
    }

    @Override
    public boolean validateAccessToken(String accessToken) {
        // First check if the token is valid using JWT validation
        if (!jwtUtils.validateJwtToken(accessToken)) {
            return false;
        }

        // Then check if the token exists in the database and is not invoked
        return tokenService.findByAccessToken(accessToken)
                .map(token -> !token.isInvoked() && token.getAccessTokenExpiryDate().isAfter(java.time.Instant.now()))
                .orElse(false);
    }
}
