package com.comp.web.repository;

import com.comp.web.model.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    // Find users ordered by total score (for global ranking)
    @Query("SELECT u FROM User u ORDER BY u.totalScore DESC")
    List<User> findAllByOrderByTotalScoreDesc();

    // Find users from a specific country ordered by total score
    @Query("SELECT u FROM User u WHERE u.countryCode = ?1 ORDER BY u.totalScore DESC")
    List<User> findByCountryCodeOrderByTotalScoreDesc(String countryCode);

    // Find users from a specific establishment ordered by total score
    @Query("SELECT u FROM User u WHERE u.establishment = ?1 ORDER BY u.totalScore DESC")
    List<User> findByEstablishmentOrderByTotalScoreDesc(String establishment);

    // Get users with pagination for global ranking
    Page<User> findAllByOrderByGlobalRankAsc(Pageable pageable);

    // Get users with pagination for country ranking
    Page<User> findByCountryCodeOrderByCountryRankAsc(String countryCode, Pageable pageable);

    // Get users with pagination for establishment ranking
    Page<User> findByEstablishmentOrderByEstablishmentRankAsc(String establishment, Pageable pageable);

    // Update global rank for a user
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.globalRank = ?2 WHERE u.id = ?1")
    void updateGlobalRank(Long userId, Integer rank);

    // Update country rank for a user
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.countryRank = ?2 WHERE u.id = ?1")
    void updateCountryRank(Long userId, Integer rank);

    // Update establishment rank for a user
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.establishmentRank = ?2 WHERE u.id = ?1")
    void updateEstablishmentRank(Long userId, Integer rank);

    // Update total score for a user
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.totalScore = ?2 WHERE u.id = ?1")
    void updateTotalScore(Long userId, Integer totalScore);
}
