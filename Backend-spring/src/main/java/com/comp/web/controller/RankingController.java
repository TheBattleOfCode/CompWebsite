package com.comp.web.controller;

import com.comp.web.model.dto.response.UserRankingResponse;
import com.comp.web.service.RankingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/rankings")
@Tag(name = "Rankings", description = "Ranking management API")
public class RankingController {

    @Autowired
    private RankingService rankingService;

    @GetMapping("/global")
    @Operation(
            summary = "Get global rankings",
            description = "Get global rankings of users based on their total score",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<Page<UserRankingResponse>> getGlobalRankings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<UserRankingResponse> rankings = rankingService.getGlobalRankings(pageable);
        return ResponseEntity.ok(rankings);
    }

    @GetMapping("/country/{countryCode}")
    @Operation(
            summary = "Get country rankings",
            description = "Get rankings of users from a specific country",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<Page<UserRankingResponse>> getCountryRankings(
            @PathVariable String countryCode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<UserRankingResponse> rankings = rankingService.getCountryRankings(countryCode, pageable);
        return ResponseEntity.ok(rankings);
    }

    @GetMapping("/establishment/{establishmentId}")
    @Operation(
            summary = "Get establishment rankings",
            description = "Get rankings of users from a specific establishment",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<Page<UserRankingResponse>> getEstablishmentRankings(
            @PathVariable Long establishmentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<UserRankingResponse> rankings = rankingService.getEstablishmentRankings(establishmentId, pageable);
        return ResponseEntity.ok(rankings);
    }

    @GetMapping("/user/{userId}")
    @Operation(
            summary = "Get user ranking",
            description = "Get the ranking of a specific user",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<UserRankingResponse> getUserRanking(@PathVariable Long userId) {
        UserRankingResponse ranking = rankingService.getUserRanking(userId);
        return ResponseEntity.ok(ranking);
    }

    @PostMapping("/recalculate")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Recalculate rankings",
            description = "Recalculate rankings for all users (requires ADMIN role)",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<Void> recalculateRankings() {
        rankingService.recalculateRankings();
        return ResponseEntity.ok().build();
    }
}
