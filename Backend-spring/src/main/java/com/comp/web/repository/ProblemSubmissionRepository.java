package com.comp.web.repository;

import com.comp.web.model.entity.Problem;
import com.comp.web.model.entity.ProblemSubmission;
import com.comp.web.model.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProblemSubmissionRepository extends JpaRepository<ProblemSubmission, Long> {
    List<ProblemSubmission> findByUserAndProblem(User user, Problem problem);
    
    Page<ProblemSubmission> findByUser(User user, Pageable pageable);
    
    Page<ProblemSubmission> findByProblem(Problem problem, Pageable pageable);
    
    @Query("SELECT ps FROM ProblemSubmission ps WHERE ps.user = ?1 AND ps.problem = ?2 AND ps.score = " +
           "(SELECT MAX(ps2.score) FROM ProblemSubmission ps2 WHERE ps2.user = ?1 AND ps2.problem = ?2)")
    Optional<ProblemSubmission> findBestSubmissionByUserAndProblem(User user, Problem problem);
    
    @Query("SELECT COUNT(DISTINCT ps.problem) FROM ProblemSubmission ps WHERE ps.user = ?1 AND ps.isCorrect = true")
    Long countSolvedProblemsByUser(User user);
    
    @Query("SELECT SUM(ps.score) FROM ProblemSubmission ps WHERE ps.user = ?1")
    Integer getTotalScoreByUser(User user);
}
