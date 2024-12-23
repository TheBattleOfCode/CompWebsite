package com.comp.web.controllers;

import java.util.HashMap;

import com.comp.web.services.AuthService;
import jakarta.validation.Valid;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.comp.web.payload.request.LoginRequest;
import com.comp.web.payload.request.SignupRequest;
import com.comp.web.payload.response.MessageResponse;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

  private final AuthService authService;

  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
    HashMap<String, Object> response = authService.authenticate(loginRequest);
    return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, response.get("header").toString())
            .body(response.get("body"));
  }

  @PostMapping("/signup")
  public ResponseEntity<MessageResponse> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
    return new ResponseEntity<>(authService.register(signUpRequest), HttpStatus.OK);
  }

  @PostMapping("/signout")
  public ResponseEntity<?> logoutUser() {
    return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, authService.logout().toString())
            .body(new MessageResponse("You've been signed out!"));
  }
}
