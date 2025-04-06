import React, { useState } from 'react';
import { TableRow, TableCell, Button, CircularProgress, Chip, Tooltip, Box, useTheme } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useGetUserProblemQuery, useGetProblemStatsQuery } from '../../services/api';
import { selectCurrentUser } from '../../features/auth/authSlice';

const ProblemItem = ({ problem }) => {
	const currentUser = useSelector(selectCurrentUser);
	const [loading, setLoading] = useState(false);
	const history = useHistory();
	const theme = useTheme();

	// Fetch user's problem data
	const { data: userProblemData } = useGetUserProblemQuery(
		{ userId: currentUser?.id, problemId: problem._id },
		{ skip: !currentUser?.id || !problem._id },
	);

	// Fetch problem statistics
	const { data: problemStats } = useGetProblemStatsQuery(problem._id, { skip: !problem._id });

	// Calculate acceptance rate
	const acceptanceRate = React.useMemo(() => {
		if (problemStats?.length > 0) {
			const totalAttempts = problemStats.length;
			const acceptedAttempts = problemStats.filter((attempt) => attempt.answered).length;
			const rate = Math.round((acceptedAttempts / totalAttempts) * 100);
			return `${rate}%`;
		}
		return 'Not played yet';
	}, [problemStats]);

	// Determine problem state
	const problemState = userProblemData?.answered ? 'solved' : userProblemData ? 'attempted' : 'white';

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
