package com.comp.web.service;

import com.comp.web.model.dto.request.CreateProblemRequest;
import com.comp.web.model.dto.response.ProblemResponse;
import com.comp.web.model.entity.EProblemType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProblemService {
    /**
     * Create a new problem
     *
     * @param createProblemRequest the problem creation request
     * @param createdByUserId the ID of the user creating the problem
     * @return the created problem
     */
    ProblemResponse createProblem(CreateProblemRequest createProblemRequest, Long createdByUserId);

    /**
     * Get a problem by ID
     *
     * @param id the problem ID
     * @return the problem
     */
    ProblemResponse getProblemById(Long id);

    /**
     * Get all problems with pagination
     *
     * @param pageable pagination information
     * @return a page of problems
     */
    Page<ProblemResponse> getAllProblems(Pageable pageable);

    /**
     * Get problems by type with pagination
     *
     * @param type the problem type
     * @param pageable pagination information
     * @return a page of problems
     */
    Page<ProblemResponse> getProblemsByType(EProblemType type, Pageable pageable);

    /**
     * Get problems by difficulty level with pagination
     *
     * @param difficultyLevel the difficulty level
     * @param pageable pagination information
     * @return a page of problems
     */
    Page<ProblemResponse> getProblemsByDifficultyLevel(Integer difficultyLevel, Pageable pageable);

    /**
     * Get problems created by a specific user with pagination
     *
     * @param userId the user ID
     * @param pageable pagination information
     * @return a page of problems
     */
    Page<ProblemResponse> getProblemsByCreatedBy(Long userId, Pageable pageable);

    /**
     * Update a problem
     *
     * @param id the problem ID
     * @param createProblemRequest the updated problem data
     * @return the updated problem
     */
    ProblemResponse updateProblem(Long id, CreateProblemRequest createProblemRequest);

    /**
     * Delete a problem
     *
     * @param id the problem ID
     */
    void deleteProblem(Long id);

    /**
     * Generate input for a problem
     *
     * @param problemId the problem ID
     * @return the generated input
     */
    String generateProblemInput(Long problemId);

    /**
     * Generate expected output for a problem given an input
     *
     * @param problemId the problem ID
     * @param input the input
     * @return the expected output
     */
    String generateProblemOutput(Long problemId, String input);
}
