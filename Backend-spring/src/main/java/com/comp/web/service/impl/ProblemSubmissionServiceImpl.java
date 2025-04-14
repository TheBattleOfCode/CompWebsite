package com.comp.web.service.impl;

import com.comp.web.exception.ResourceNotFoundException;
import com.comp.web.model.dto.request.SubmitProblemRequest;
import com.comp.web.model.dto.response.ProblemSubmissionResponse;
import com.comp.web.model.dto.response.SubmissionResultResponse;
import com.comp.web.model.entity.Problem;
import com.comp.web.model.entity.ProblemSubmission;
import com.comp.web.model.entity.User;
import com.comp.web.repository.ProblemRepository;
import com.comp.web.repository.ProblemSubmissionRepository;
import com.comp.web.repository.UserRepository;
import com.comp.web.service.ProblemService;
import com.comp.web.service.ProblemSubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProblemSubmissionServiceImpl implements ProblemSubmissionService {

    @Autowired
    private ProblemSubmissionRepository problemSubmissionRepository;

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProblemService problemService;

    @Override
    @Transactional
    public SubmissionResultResponse submitProblem(SubmitProblemRequest submitProblemRequest, Long userId) {
        Problem problem = problemRepository.findById(submitProblemRequest.getProblemId())
                .orElseThrow(() -> new ResourceNotFoundException("Problem", "id", submitProblemRequest.getProblemId()));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Generate a random input for the problem
        String input = problemService.generateProblemInput(problem.getId());

        // Generate the expected output for the input
        String expectedOutput = problemService.generateProblemOutput(problem.getId(), input);

        // Compare the submitted answer with the expected output
        boolean isCorrect = submitProblemRequest.getAnswer().trim().equals(expectedOutput.trim());

        // Calculate score based on correctness and problem max score
        int score = isCorrect ? problem.getMaxScore() : 0;

        // Create and save the submission
        ProblemSubmission submission = new ProblemSubmission();
        submission.setProblem(problem);
        submission.setUser(user);
        submission.setSubmittedAnswer(submitProblemRequest.getAnswer());
        submission.setIsCorrect(isCorrect);
        submission.setScore(score);

        ProblemSubmission savedSubmission = problemSubmissionRepository.save(submission);

        // Create and return the submission result
        return SubmissionResultResponse.builder()
                .submissionId(savedSubmission.getId())
                .isCorrect(isCorrect)
                .score(score)
                .message(isCorrect ? "Correct answer!" : "Incorrect answer. Try again.")
                .build();
    }

    @Override
    public ProblemSubmissionResponse getSubmissionById(Long id) {
        ProblemSubmission submission = problemSubmissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission", "id", id));
        return mapSubmissionToResponse(submission);
    }

    @Override
    public Page<ProblemSubmissionResponse> getSubmissionsByUser(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return problemSubmissionRepository.findByUser(user, pageable)
                .map(this::mapSubmissionToResponse);
    }

    @Override
    public Page<ProblemSubmissionResponse> getSubmissionsByProblem(Long problemId, Pageable pageable) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem", "id", problemId));
        return problemSubmissionRepository.findByProblem(problem, pageable)
                .map(this::mapSubmissionToResponse);
    }

    @Override
    public ProblemSubmissionResponse getBestSubmissionByUserAndProblem(Long userId, Long problemId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem", "id", problemId));

        return problemSubmissionRepository.findBestSubmissionByUserAndProblem(user, problem)
                .map(this::mapSubmissionToResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Submission", "user and problem", userId + ", " + problemId));
    }

    @Override
    public Long countSolvedProblemsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return problemSubmissionRepository.countSolvedProblemsByUser(user);
    }

    @Override
    public Integer getTotalScoreByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Integer totalScore = problemSubmissionRepository.getTotalScoreByUser(user);
        return totalScore != null ? totalScore : 0;
    }

    private ProblemSubmissionResponse mapSubmissionToResponse(ProblemSubmission submission) {
        return ProblemSubmissionResponse.builder()
                .id(submission.getId())
                .problemId(submission.getProblem().getId())
                .problemTitle(submission.getProblem().getTitle())
                .username(submission.getUser().getUsername())
                .submittedAnswer(submission.getSubmittedAnswer())
                .isCorrect(submission.getIsCorrect())
                .score(submission.getScore())
                .submittedAt(submission.getSubmittedAt())
                .build();
    }
}
