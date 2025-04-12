package com.comp.web.repository;

import com.comp.web.model.entity.Token;
import com.comp.web.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {
    Optional<Token> findByAccessToken(String accessToken);
    
    Optional<Token> findByRefreshToken(String refreshToken);
    
    @Modifying
    int deleteByUser(User user);
}
