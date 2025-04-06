import React, { useEffect, useState } from 'react';
import { TableRow, TableCell, Button, CircularProgress } from '@mui/material';
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
			setProblemState(userProblemData.data.answered ? 'bg-success' : 'table-active');
		}
	}, [userProblemData]);

	// Fetch data on component mount
	useEffect(() => {
		fetchUserProblemData();
		fetchProblemStats();
	}, [problem._id, currentUser?.id]);

	const handleEnterProblem = () => {
		setLoading(true);
		history.push(`/ProbNumberGen/${problem._id}`);
	};

	return (
		<TableRow className={problemState + ' rounded'}>
			<TableCell>{problem.title || 'Untitled Problem'}</TableCell>
			<TableCell>{problem.type || 'Unknown'}</TableCell>
			<TableCell>{acceptanceRate}</TableCell>
			<TableCell>
				<Button
					variant="outlined"
					color={problemState !== 'bg-success' ? 'primary' : 'success'}
					onClick={handleEnterProblem}
					disabled={loading}
					startIcon={loading ? <CircularProgress size={20} /> : null}
				>
					{problemState === 'bg-success' ? 'Solved' : 'Enter'}
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
