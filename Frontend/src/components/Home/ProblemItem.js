import React, { useEffect, useState } from 'react';
import { TableRow, TableCell, Button, CircularProgress, Chip, Tooltip, Box, useTheme } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import authService from '../../services/auth.service';
import genProblemService from '../../services/gen-problem.service';

const ProblemItem = ({ problem }) => {
	const currentUser = authService.getCurrentUser();
	const [problemState, setProblemState] = useState('white');
	const [userProblemData, setUserProblemData] = useState({});
	const [problemStats, setProblemStats] = useState([]);
	const [acceptanceRate, setAcceptanceRate] = useState('Not played yet');
	const [loading, setLoading] = useState(false);
	const history = useHistory();
	const theme = useTheme();

	const fetchUserProblemData = async () => {
		if (!currentUser?.id || !problem._id) return;

		try {
			const response = await genProblemService.GetGenProb(currentUser.id, problem._id);
			setUserProblemData(response);
		} catch (error) {
			console.error('Error fetching user problem data:', error);
		}
	};

	const fetchProblemStats = async () => {
		if (!problem._id) return;

		try {
			const response = await genProblemService.GetAllGenProbByProb(problem._id);
			setProblemStats(response);
		} catch (error) {
			console.error('Error fetching problem stats:', error);
		}
	};

	// Calculate acceptance rate when problem stats change
	useEffect(() => {
		if (problemStats.data && problemStats.data.length > 0) {
			const totalAttempts = problemStats.data.length;
			const acceptedAttempts = problemStats.data.filter((attempt) => attempt.answered).length;
			const rate = Math.round((acceptedAttempts / totalAttempts) * 100);
			setAcceptanceRate(`${rate}%`);
		}
	}, [problemStats]);

	// Update problem state when user data changes
	useEffect(() => {
		if (userProblemData.data) {
			setProblemState(userProblemData.data.answered ? 'solved' : 'attempted');
		}
	}, [userProblemData]);

	// Fetch data on component mount
	useEffect(() => {
		fetchUserProblemData();
		fetchProblemStats();
	}, [problem._id, currentUser?.id]);

	const handleEnterProblem = () => {
		setLoading(true);
		history.push(`/problem/${problem._id}`);
	};

	// Get color based on problem type
	const getTypeColor = (type) => {
		switch (type) {
			case 'gen':
				return 'primary';
			case 'NumberGen':
				return 'secondary';
			case 'Qna':
				return 'success';
			default:
				return 'default';
		}
	};

	// Get background color based on problem state
	const getRowStyle = () => {
		if (problemState === 'solved') {
			return {
				backgroundColor: theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(76, 175, 80, 0.1)',
			};
		}
		if (problemState === 'attempted') {
			return {
				backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 152, 0, 0.15)' : 'rgba(255, 152, 0, 0.1)',
			};
		}
		return {};
	};

	return (
		<TableRow
			hover
			sx={{
				...getRowStyle(),
				'&:hover': {
					backgroundColor:
						theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
				},
			}}
		>
			<TableCell>
				<Box sx={{ fontWeight: problemState === 'solved' ? 'bold' : 'normal' }}>
					{problem.title || 'Untitled Problem'}
				</Box>
			</TableCell>
			<TableCell>
				<Chip
					label={problem.type || 'Unknown'}
					color={getTypeColor(problem.type)}
					size="small"
					variant={problemState === 'solved' ? 'filled' : 'outlined'}
				/>
			</TableCell>
			<TableCell>
				<Tooltip title={`${acceptanceRate} of users solved this problem`}>
					<Chip
						label={acceptanceRate}
						color={acceptanceRate !== 'Not played yet' ? 'info' : 'default'}
						size="small"
						variant="outlined"
					/>
				</Tooltip>
			</TableCell>
			<TableCell>
				<Button
					variant={problemState === 'solved' ? 'contained' : 'outlined'}
					color={problemState === 'solved' ? 'success' : 'primary'}
					onClick={handleEnterProblem}
					disabled={loading}
					startIcon={
						loading ? (
							<CircularProgress size={20} />
						) : problemState === 'solved' ? (
							<CheckCircleIcon />
						) : (
							<PlayArrowIcon />
						)
					}
					size="small"
					sx={{
						minWidth: '100px',
						borderRadius: 2,
					}}
				>
					{problemState === 'solved' ? 'Solved' : 'Enter'}
				</Button>
			</TableCell>
		</TableRow>
	);
};

ProblemItem.propTypes = {
	problem: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		title: PropTypes.string,
		type: PropTypes.string,
	}).isRequired,
};

export default ProblemItem;
