package com.comp.web.service;

import com.comp.web.exception.ResourceNotFoundException;
import com.comp.web.model.dto.request.CreateProblemRequest;
import com.comp.web.model.dto.response.ProblemResponse;
import com.comp.web.model.entity.EProblemType;
import com.comp.web.model.entity.Problem;
import com.comp.web.model.entity.User;
import com.comp.web.repository.ProblemRepository;
import com.comp.web.repository.UserRepository;
import com.comp.web.service.impl.ProblemServiceImpl;
import org.mockito.ArgumentMatchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProblemServiceTest {

    @Mock
    private ProblemRepository problemRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ProblemServiceImpl problemService;

    private User user;
    private Problem problem;
    private CreateProblemRequest createProblemRequest;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPassword("password");

        problem = new Problem();
        problem.setId(1L);
        problem.setTitle("Test Problem");
        problem.setDescription("This is a test problem");
        problem.setType(EProblemType.NUMBER_GEN);
        problem.setInputGeneratorCode("Math.floor(Math.random() * 100)");
        problem.setOutputGeneratorCode("parseInt(input) * 2");
        problem.setSampleInput("10");
        problem.setSampleOutput("20");
        problem.setDifficultyLevel(5);
        problem.setMaxScore(100);
        problem.setCreatedBy(user);
        problem.setCreatedAt(LocalDateTime.now());
        problem.setUpdatedAt(LocalDateTime.now());

        createProblemRequest = new CreateProblemRequest();
        createProblemRequest.setTitle("Test Problem");
        createProblemRequest.setDescription("This is a test problem");
        createProblemRequest.setType(EProblemType.NUMBER_GEN);
        createProblemRequest.setInputGeneratorCode("Math.floor(Math.random() * 100)");
        createProblemRequest.setOutputGeneratorCode("parseInt(input) * 2");
        createProblemRequest.setSampleInput("10");
        createProblemRequest.setSampleOutput("20");
        createProblemRequest.setDifficultyLevel(5);
        createProblemRequest.setMaxScore(100);
    }

    @Test
    void createProblem_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(problemRepository.save(any(Problem.class))).thenReturn(problem);

        ProblemResponse response = problemService.createProblem(createProblemRequest, 1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Test Problem", response.getTitle());
        assertEquals("This is a test problem", response.getDescription());
        assertEquals(EProblemType.NUMBER_GEN, response.getType());
        assertEquals("10", response.getSampleInput());
        assertEquals("20", response.getSampleOutput());
        assertEquals(5, response.getDifficultyLevel());
        assertEquals(100, response.getMaxScore());
        assertEquals("testuser", response.getCreatedByUsername());

        verify(userRepository).findById(1L);
        verify(problemRepository).save(any(Problem.class));
    }

    @Test
    void createProblem_UserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            problemService.createProblem(createProblemRequest, 1L);
        });

        verify(userRepository).findById(1L);
        verify(problemRepository, never()).save(any(Problem.class));
    }

    @Test
    void getProblemById_Success() {
        when(problemRepository.findById(1L)).thenReturn(Optional.of(problem));

        ProblemResponse response = problemService.getProblemById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Test Problem", response.getTitle());
        assertEquals("This is a test problem", response.getDescription());
        assertEquals(EProblemType.NUMBER_GEN, response.getType());
        assertEquals("10", response.getSampleInput());
        assertEquals("20", response.getSampleOutput());
        assertEquals(5, response.getDifficultyLevel());
        assertEquals(100, response.getMaxScore());
        assertEquals("testuser", response.getCreatedByUsername());

        verify(problemRepository).findById(1L);
    }

    @Test
    void getProblemById_NotFound() {
        when(problemRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            problemService.getProblemById(1L);
        });

        verify(problemRepository).findById(1L);
    }

    @Test
    void getAllProblems_Success() {
        Page<Problem> problemPage = new PageImpl<>(List.of(problem));
        Pageable pageable = PageRequest.of(0, 10);

        when(problemRepository.findAll(pageable)).thenReturn(problemPage);

        Page<ProblemResponse> response = problemService.getAllProblems(pageable);

        assertNotNull(response);
        assertEquals(1, response.getTotalElements());
        assertEquals(1, response.getContent().size());
        assertEquals(1L, response.getContent().get(0).getId());
        assertEquals("Test Problem", response.getContent().get(0).getTitle());

        verify(problemRepository).findAll(pageable);
    }

    @Test
    void getProblemsByType_Success() {
        Page<Problem> problemPage = new PageImpl<>(List.of(problem));
        Pageable pageable = PageRequest.of(0, 10);

        when(problemRepository.findByType(EProblemType.NUMBER_GEN, pageable)).thenReturn(problemPage);

        Page<ProblemResponse> response = problemService.getProblemsByType(EProblemType.NUMBER_GEN, pageable);

        assertNotNull(response);
        assertEquals(1, response.getTotalElements());
        assertEquals(1, response.getContent().size());
        assertEquals(1L, response.getContent().get(0).getId());
        assertEquals("Test Problem", response.getContent().get(0).getTitle());
        assertEquals(EProblemType.NUMBER_GEN, response.getContent().get(0).getType());

        verify(problemRepository).findByType(EProblemType.NUMBER_GEN, pageable);
    }

    @Test
    void updateProblem_Success() {
        when(problemRepository.findById(1L)).thenReturn(Optional.of(problem));
        when(problemRepository.save(any(Problem.class))).thenReturn(problem);

        createProblemRequest.setTitle("Updated Problem");
        createProblemRequest.setDescription("This is an updated problem");

        ProblemResponse response = problemService.updateProblem(1L, createProblemRequest);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Updated Problem", response.getTitle());
        assertEquals("This is an updated problem", response.getDescription());

        verify(problemRepository).findById(1L);
        verify(problemRepository).save(any(Problem.class));
    }

    @Test
    void updateProblem_NotFound() {
        when(problemRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            problemService.updateProblem(1L, createProblemRequest);
        });

        verify(problemRepository).findById(1L);
        verify(problemRepository, never()).save(any(Problem.class));
    }

    @Test
    void deleteProblem_Success() {
        when(problemRepository.existsById(1L)).thenReturn(true);
        doNothing().when(problemRepository).deleteById(1L);

        problemService.deleteProblem(1L);

        verify(problemRepository).existsById(1L);
        verify(problemRepository).deleteById(1L);
    }

    @Test
    void deleteProblem_NotFound() {
        when(problemRepository.existsById(1L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> {
            problemService.deleteProblem(1L);
        });

        verify(problemRepository).existsById(1L);
        verify(problemRepository, never()).deleteById(any());
    }

    @Test
    void generateProblemInput_Success() {
        when(problemRepository.findById(1L)).thenReturn(Optional.of(problem));

        String input = problemService.generateProblemInput(1L);

        assertNotNull(input);
        verify(problemRepository).findById(1L);
    }

    @Test
    void generateProblemOutput_Success() {
        when(problemRepository.findById(1L)).thenReturn(Optional.of(problem));

        String output = problemService.generateProblemOutput(1L, "10");

        assertNotNull(output);
        verify(problemRepository).findById(1L);
    }
}
