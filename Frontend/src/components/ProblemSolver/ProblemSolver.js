import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Typography, 
  Button, 
  TextField, 
  Alert, 
  Paper, 
  Box, 
  Divider,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  useTheme
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import QuizIcon from '@mui/icons-material/Quiz';
import CalculateIcon from '@mui/icons-material/Calculate';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import authService from '../../services/auth.service';
import genProblemService from '../../services/gen-problem.service';
import probService from '../../services/prob.service';
import userService from '../../services/user.service';
import { generateInOut, handleAnswerSubmit } from './utils';
import { Remarkable } from 'remarkable';

function ProblemSolver() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [userProblemData, setUserProblemData] = useState(null);
  const [generatedData, setGeneratedData] = useState(null);
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [markdownPreview, setMarkdownPreview] = useState('');

  const currentUser = authService.getCurrentUser();
  const md = new Remarkable({
    html: false,        // Enable HTML tags in source
    xhtmlOut: false,    // Use '/' to close single tags (<br />)
    breaks: true,       // Convert '\n' in paragraphs into <br>
    langPrefix: 'language-',  // CSS language prefix for fenced blocks
    linkify: true,      // Autoconvert URL-like text to links
    typographer: true,  // Enable smartypants and other sweet transforms
  });
  const theme = useTheme();

  // Fetch problem and user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch problem data
        const problemResponse = await probService.GetProb(id);
        setProblem(problemResponse.data);
        
        // Render markdown preview
        if (problemResponse.data.description) {
          setMarkdownPreview(md.render(problemResponse.data.description));
        }

        // Fetch user's problem data
        const userProblemResponse = await genProblemService.GetGenProb(currentUser.id, id);
        setUserProblemData(userProblemResponse.data);

        // Generate problem data if needed
        if (problemResponse.data.type === 'gen' && problemResponse.data.file) {
          const generatedResult = generateInOut(problemResponse.data.file);
          setGeneratedData(generatedResult);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('Error loading problem data');
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentUser.id]);

  const submitAnswer = async () => {
    if (!answer.trim()) {
      setMessage('Please enter an answer');
      setMessageType('warning');
      return;
    }
    
    setSubmitting(true);

    try {
      const result = await handleAnswerSubmit({
        problem,
        answer,
        currentUser,
        userProblemData,
        genProblemService,
        userService,
      });

      setMessage(result.message);
      setMessageType(result.success ? 'success' : 'error');

      // Refresh user problem data after submission
      if (result.success) {
        const updatedUserProblemResponse = await genProblemService.GetGenProb(currentUser.id, id);
        setUserProblemData(updatedUserProblemResponse.data);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      setMessage('Error submitting answer');
      setMessageType('error');
    } finally {
      setSubmitting(false);
    }
  };

  // Get problem type icon
  const getProblemTypeIcon = (type) => {
    switch (type) {
      case 'NumberGen':
        return <CalculateIcon />;
      case 'Qna':
        return <QuizIcon />;
      case 'gen':
      default:
        return <CodeIcon />;
    }
  };

  // Get problem type color
  const getProblemTypeColor = (type) => {
    switch (type) {
      case 'NumberGen':
        return 'secondary';
      case 'Qna':
        return 'success';
      case 'gen':
      default:
        return 'primary';
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Container>
    );
  }

  if (!problem) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          Problem not found. The problem may have been removed or you don't have access to it.
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        {/* Problem Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              {problem.title || 'Untitled Problem'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip 
                icon={getProblemTypeIcon(problem.type)} 
                label={problem.type || 'Unknown'} 
                color={getProblemTypeColor(problem.type)}
                size="medium"
              />
              <Chip 
                label={`Score: ${problem.score || 0}`} 
                variant="outlined" 
                color="default"
              />
              {userProblemData?.answered && (
                <Chip 
                  icon={<CheckCircleIcon />} 
                  label="Solved" 
                  color="success"
                />
              )}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Problem Description */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          Description
        </Typography>
        <Paper 
          elevation={1} 
          sx={{ 
            p: 3, 
            mb: 4, 
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
            borderRadius: 2
          }}
        >
          <div
            className="markdown-body"
            dangerouslySetInnerHTML={{
              __html: markdownPreview,
            }}
          />
        </Paper>

        {/* Problem-specific UI */}
        {problem.type === 'NumberGen' && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Number Generator Problem
              </Typography>
              <Typography variant="body1">
                Generate a number between <strong>{problem.min}</strong> and <strong>{problem.max}</strong>
              </Typography>
            </CardContent>
          </Card>
        )}

        {problem.type === 'gen' && generatedData && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Generated Test Data
              </Typography>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  overflow: 'auto'
                }}
              >
                <pre>{JSON.stringify(generatedData, null, 2)}</pre>
              </Paper>
            </CardContent>
          </Card>
        )}

        {problem.type === 'Qna' && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Q&A Problem
              </Typography>
              <Typography variant="body1">
                Please provide your answer to the question above.
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Answer Input */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          Your Answer
        </Typography>
        <TextField
          label="Enter your solution here"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={userProblemData?.answered || submitting}
          sx={{ mb: 3 }}
        />

        {/* Submit Button */}
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={submitAnswer}
          disabled={submitting || userProblemData?.answered}
          startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{ mb: 3 }}
        >
          {submitting ? 'Submitting...' : userProblemData?.answered ? 'Already Solved' : 'Submit Answer'}
        </Button>

        {/* Status Message */}
        {message && (
          <Alert severity={messageType} sx={{ mb: 3 }}>
            {message}
          </Alert>
        )}

        {/* Previous Attempts */}
        {userProblemData && (
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Submission Status
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body1">
                  Status: <strong>{userProblemData.answered ? 'Solved' : 'Not solved yet'}</strong>
                </Typography>
                {userProblemData.answered && (
                  <Typography variant="body1" color="success.main">
                    Congratulations! You solved this problem.
                  </Typography>
                )}
                {userProblemData.tries > 0 && (
                  <Typography variant="body1">
                    Attempts: <strong>{userProblemData.tries}</strong>
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        )}
      </Paper>
    </Container>
  );
}

export default ProblemSolver;
