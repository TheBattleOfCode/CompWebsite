import {
    AccordionDetails,
    Box,
    Button,
    Container,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    Radio,
    RadioGroup,
    Slider,
    TextField,
    Typography,
    styled,
    Alert,
    CircularProgress,
    Paper,
} from '@mui/material';
import MuiInput from '@mui/material/Input';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Remarkable } from 'remarkable';

import AuthService from '../../services/auth.service';
import probService from '../../services/prob.service';

import { handleFileChange, handleSubmit, renderMarkdown } from './utils';
import './styles.css';

const Input = styled(MuiInput)`
    width: 42px;
`;

const CreateProblem = () => {
    const [problemType, setProblemType] = useState('N/A');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [score, setScore] = useState(0);
    const [file] = useState('');
    const [qnaAnswer, setQnaAnswer] = useState('');
    const [successful, setSuccessful] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    // For NumberGen type
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(100);
    const [answer, setAnswer] = useState(0);

    // For file upload
    const [fileContent, setFileContent] = useState('');
    const [fileName, setFileName] = useState('');

    const md = new Remarkable();
    const history = useHistory();

    // Check if user is admin
    useEffect(() => {
        const checkAdminStatus = () => {
            setCheckingAuth(true);
            const currentUser = AuthService.getCurrentUser();

            if (!currentUser || !currentUser.roles.includes('ROLE_ADMIN')) {
                history.push({
                    pathname: '/home',
                    state: { message: 'You need admin privileges to access this page' },
                });
            } else {
                setIsAdmin(true);
            }

            setCheckingAuth(false);
        };

        checkAdminStatus();
    }, [history]);

    const onSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setSuccessful(false);

        handleSubmit({
            problemType,
            title,
            description,
            score,
            file,
            qnaAnswer,
            min,
            max,
            answer,
            fileContent,
            setSuccessful,
            setMessage,
            setLoading,
            probService,
        });
    };

    const handleScoreChange = (event, newValue) => {
        setScore(newValue);
    };

    const handleScoreInputChange = (event) => {
        setScore(event.target.value === '' ? 0 : Number(event.target.value));
    };

    const handleMinChange = (event) => {
        setMin(Number(event.target.value));
    };

    const handleMaxChange = (event) => {
        setMax(Number(event.target.value));
    };

    const handleAnswerChange = (event) => {
        setAnswer(Number(event.target.value));
    };

    const handleFileUpload = (e) => {
        handleFileChange(e, setFileContent, setFileName);
    };

    if (checkingAuth) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    if (!isAdmin) {
        return null; // Will redirect in useEffect
    }

    return (
        <Container>
            <Paper elevation={3} sx={{ p: 3, mt: 3, mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Create Problem
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Admin access required
                </Typography>

                <form onSubmit={onSubmit}>
                    <Grid container spacing={3}>
                        {/* Problem Type Selection */}
                        <Grid item xs={12}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Problem Type</FormLabel>
                                <RadioGroup row value={problemType} onChange={(e) => setProblemType(e.target.value)}>
                                    <FormControlLabel value="gen" control={<Radio />} label="General" />
                                    <FormControlLabel value="NumberGen" control={<Radio />} label="Number Generator" />
                                    <FormControlLabel value="Qna" control={<Radio />} label="Q&A" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                        {/* Title */}
                        <Grid item xs={12}>
                            <TextField
                                label="Title"
                                variant="outlined"
                                fullWidth
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </Grid>

                        {/* Description */}
                        <Grid item xs={12}>
                            <TextField
                                label="Description"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={6}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </Grid>

                        {/* Markdown Preview */}
                        <Grid item xs={12}>
                            <Typography variant="h6">Preview:</Typography>
                            <div
                                className="markdown-preview"
                                dangerouslySetInnerHTML={{ __html: renderMarkdown(description, md) }}
                            />
                        </Grid>

                        {/* Score */}
                        <Grid item xs={12}>
                            <Typography id="input-slider" gutterBottom>
                                Score
                            </Typography>
                            <Box sx={{ width: 250 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs>
                                        <Slider
                                            value={typeof score === 'number' ? score : 0}
                                            onChange={handleScoreChange}
                                            aria-labelledby="input-slider"
                                            min={0}
                                            max={100}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Input
                                            value={score}
                                            size="small"
                                            onChange={handleScoreInputChange}
                                            inputProps={{
                                                step: 10,
                                                min: 0,
                                                max: 100,
                                                type: 'number',
                                                'aria-labelledby': 'input-slider',
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>

                        {/* Type-specific inputs */}
                        {problemType === 'NumberGen' && (
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <TextField
                                            label="Min"
                                            type="number"
                                            value={min}
                                            onChange={handleMinChange}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            label="Max"
                                            type="number"
                                            value={max}
                                            onChange={handleMaxChange}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            label="Answer"
                                            type="number"
                                            value={answer}
                                            onChange={handleAnswerChange}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        )}

                        {problemType === 'Qna' && (
                            <Grid item xs={12}>
                                <TextField
                                    label="Answer"
                                    variant="outlined"
                                    fullWidth
                                    value={qnaAnswer}
                                    onChange={(e) => setQnaAnswer(e.target.value)}
                                />
                            </Grid>
                        )}

                        {problemType === 'gen' && (
                            <Grid item xs={12}>
                                <Button variant="contained" component="label">
                                    Upload File
                                    <input type="file" hidden onChange={handleFileUpload} />
                                </Button>
                                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                    {fileName || 'No file chosen'}
                                </Typography>
                            </Grid>
                        )}

                        {/* Submit Button */}
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={loading || problemType === 'N/A'}
                                sx={{ mt: 2 }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Create Problem'}
                            </Button>
                        </Grid>

                        {/* Status Message */}
                        {message && (
                            <Grid item xs={12}>
                                <Alert severity={successful ? 'success' : 'error'}>{message}</Alert>
                            </Grid>
                        )}
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default CreateProblem;
