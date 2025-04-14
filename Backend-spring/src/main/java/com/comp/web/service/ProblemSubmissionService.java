package com.comp.web.service;

import com.comp.web.model.dto.request.SubmitProblemRequest;
import com.comp.web.model.dto.response.ProblemSubmissionResponse;
import com.comp.web.model.dto.response.SubmissionResultResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProblemSubmissionService {
    /**
     * Submit a solution to a problem
     *
     * @param submitProblemRequest the submission request
     * @param userId the ID of the user submitting the solution
     * @return the submission result
     */
    SubmissionResultResponse submitProblem(SubmitProblemRequest submitProblemRequest, Long userId);

    /**
     * Get a submission by ID
     *
     * @param id the submission ID
     * @return the submission
     */
    ProblemSubmissionResponse getSubmissionById(Long id);

    /**
     * Get all submissions by a user with pagination
     *
     * @param userId the user ID
     * @param pageable pagination information
     * @return a page of submissions
     */
    Page<ProblemSubmissionResponse> getSubmissionsByUser(Long userId, Pageable pageable);

    /**
     * Get all submissions for a problem with pagination
     *
     * @param problemId the problem ID
     * @param pageable pagination information
     * @return a page of submissions
     */
    Page<ProblemSubmissionResponse> getSubmissionsByProblem(Long problemId, Pageable pageable);

    /**
     * Get the best submission by a user for a problem
     *
     * @param userId the user ID
     * @param problemId the problem ID
     * @return the best submission
     */
    ProblemSubmissionResponse getBestSubmissionByUserAndProblem(Long userId, Long problemId);

    /**
     * Count the number of problems solved by a user
     *
     * @param userId the user ID
     * @return the number of problems solved
     */
    Long countSolvedProblemsByUser(Long userId);

    /**
     * Get the total score of a user
     *
     * @param userId the user ID
     * @return the total score
     */
    Integer getTotalScoreByUser(Long userId);
}
