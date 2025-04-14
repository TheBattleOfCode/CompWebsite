package com.comp.web.repository;

import com.comp.web.model.entity.EProblemType;
import com.comp.web.model.entity.Problem;
import com.comp.web.model.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {
    Page<Problem> findByType(EProblemType type, Pageable pageable);
    
    Page<Problem> findByDifficultyLevel(Integer difficultyLevel, Pageable pageable);
    
    Page<Problem> findByCreatedBy(User createdBy, Pageable pageable);
    
    List<Problem> findByTypeAndDifficultyLevel(EProblemType type, Integer difficultyLevel);
}
