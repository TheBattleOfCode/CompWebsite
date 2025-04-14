package com.comp.web.controller;

import com.comp.web.model.dto.request.CreateProblemRequest;
import com.comp.web.model.dto.request.SubmitProblemRequest;
import com.comp.web.model.dto.response.ProblemResponse;
import com.comp.web.model.dto.response.ProblemSubmissionResponse;
import com.comp.web.model.dto.response.SubmissionResultResponse;
import com.comp.web.model.entity.EProblemType;
import com.comp.web.service.ProblemService;
import com.comp.web.service.ProblemSubmissionService;
import com.comp.web.service.impl.UserDetailsImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/problems")
@Tag(name = "Problems", description = "Problem management API")
public class ProblemController {

    @Autowired
    private ProblemService problemService;

    @Autowired
    private ProblemSubmissionService problemSubmissionService;

    @GetMapping
    @Operation(
            summary = "Get all problems",
            description = "Get all problems with pagination",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<Page<ProblemResponse>> getAllProblems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<ProblemResponse> problems = problemService.getAllProblems(pageable);
        return ResponseEntity.ok(problems);
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Get problem by ID",
            description = "Get a problem by its ID",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<ProblemResponse> getProblemById(@PathVariable Long id) {
        ProblemResponse problem = problemService.getProblemById(id);
        return ResponseEntity.ok(problem);
    }

    @GetMapping("/type/{type}")
    @Operation(
            summary = "Get problems by type",
            description = "Get problems by type with pagination",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<Page<ProblemResponse>> getProblemsByType(
            @PathVariable EProblemType type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<ProblemResponse> problems = problemService.getProblemsByType(type, pageable);
        return ResponseEntity.ok(problems);
    }

    @GetMapping("/difficulty/{level}")
    @Operation(
            summary = "Get problems by difficulty level",
            description = "Get problems by difficulty level with pagination",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<Page<ProblemResponse>> getProblemsByDifficultyLevel(
            @PathVariable Integer level,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<ProblemResponse> problems = problemService.getProblemsByDifficultyLevel(level, pageable);
        return ResponseEntity.ok(problems);
    }

    @PostMapping
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    @Operation(
            summary = "Create a new problem",
            description = "Create a new problem (requires MODERATOR or ADMIN role)",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<ProblemResponse> createProblem(@Valid @RequestBody CreateProblemRequest createProblemRequest) {
        UserDetailsImpl userDetails = getCurrentUser();
        ProblemResponse problem = problemService.createProblem(createProblemRequest, userDetails.getId());
        return ResponseEntity.ok(problem);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    @Operation(
            summary = "Update a problem",
            description = "Update an existing problem (requires MODERATOR or ADMIN role)",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<ProblemResponse> updateProblem(
            @PathVariable Long id,
            @Valid @RequestBody CreateProblemRequest createProblemRequest) {

        ProblemResponse problem = problemService.updateProblem(id, createProblemRequest);
        return ResponseEntity.ok(problem);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Delete a problem",
            description = "Delete a problem (requires ADMIN role)",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<Void> deleteProblem(@PathVariable Long id) {
        problemService.deleteProblem(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/submit")
    @Operation(
            summary = "Submit a problem solution",
            description = "Submit a solution to a problem",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<SubmissionResultResponse> submitProblem(@Valid @RequestBody SubmitProblemRequest submitProblemRequest) {
        UserDetailsImpl userDetails = getCurrentUser();
        SubmissionResultResponse result = problemSubmissionService.submitProblem(submitProblemRequest, userDetails.getId());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/submissions")
    @Operation(
            summary = "Get user submissions",
            description = "Get all submissions by the current user",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<Page<ProblemSubmissionResponse>> getUserSubmissions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        UserDetailsImpl userDetails = getCurrentUser();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "submittedAt"));
        Page<ProblemSubmissionResponse> submissions = problemSubmissionService.getSubmissionsByUser(userDetails.getId(), pageable);
        return ResponseEntity.ok(submissions);
    }

    @GetMapping("/submissions/{problemId}")
    @Operation(
            summary = "Get user submissions for a problem",
            description = "Get the best submission by the current user for a specific problem",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<ProblemSubmissionResponse> getBestSubmissionForProblem(@PathVariable Long problemId) {
        UserDetailsImpl userDetails = getCurrentUser();
        ProblemSubmissionResponse submission = problemSubmissionService.getBestSubmissionByUserAndProblem(userDetails.getId(), problemId);
        return ResponseEntity.ok(submission);
    }

    @GetMapping("/stats/solved")
    @Operation(
            summary = "Get solved problems count",
            description = "Get the number of problems solved by the current user",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<Long> getSolvedProblemsCount() {
        UserDetailsImpl userDetails = getCurrentUser();
        Long count = problemSubmissionService.countSolvedProblemsByUser(userDetails.getId());
        return ResponseEntity.ok(count);
    }

    @GetMapping("/stats/score")
    @Operation(
            summary = "Get total score",
            description = "Get the total score of the current user",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<Integer> getTotalScore() {
        UserDetailsImpl userDetails = getCurrentUser();
        Integer score = problemSubmissionService.getTotalScoreByUser(userDetails.getId());
        return ResponseEntity.ok(score);
    }

    @GetMapping("/{id}/generate-input")
    @Operation(
            summary = "Generate problem input",
            description = "Generate input for a problem",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<String> generateProblemInput(@PathVariable Long id) {
        String input = problemService.generateProblemInput(id);
        return ResponseEntity.ok(input);
    }

    private UserDetailsImpl getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserDetailsImpl) authentication.getPrincipal();
    }
}
