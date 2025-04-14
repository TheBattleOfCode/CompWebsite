package com.comp.web.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/test")
@Tag(name = "Test", description = "Test API for role-based access control")
public class TestController {
    
    @GetMapping("/all")
    @Operation(summary = "Public content", description = "Access public content without authentication")
    public String allAccess() {
        return "Public Content.";
    }

    @GetMapping("/user")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    @Operation(
        summary = "User content", 
        description = "Access content for authenticated users",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public String userAccess() {
        return "User Content.";
    }

    @GetMapping("/mod")
    @PreAuthorize("hasRole('MODERATOR')")
    @Operation(
        summary = "Moderator content", 
        description = "Access content for moderators only",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public String moderatorAccess() {
        return "Moderator Board.";
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
        summary = "Admin content", 
        description = "Access content for administrators only",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public String adminAccess() {
        return "Admin Board.";
    }
}
