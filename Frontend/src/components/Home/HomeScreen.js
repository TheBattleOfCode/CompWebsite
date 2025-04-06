import React, { useEffect, useState } from 'react';
import {
	MenuItem,
	Select,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Typography,
	CircularProgress,
	Box,
	Alert,
} from '@mui/material';
import authService from '../../services/auth.service';
import probService from '../../services/prob.service';
import ProblemItem from './ProblemItem';
import { filterProblemsByType } from './utils';

const HomeScreen = () => {
	const [problems, setProblems] = useState([]);
	const [filteredProblems, setFilteredProblems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const currentUser = authService.getCurrentUser();

	const fetchProblems = async () => {
		try {
			setLoading(true);
			const response = await probService.GetProbs();
			setProblems(response.data);
			setFilteredProblems(response.data);
			setError('');
		} catch (error) {
			console.error('Error fetching problems:', error);
			setError('Failed to load problems. Please try again later.');
		} finally {
			setLoading(false);
		}
	};

	const handleTypeChange = (type) => {
		setFilteredProblems(filterProblemsByType(problems, type));
	};

	useEffect(() => {
		fetchProblems();
	}, []);

	if (loading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Alert severity="error" sx={{ mt: 2 }}>
				{error}
			</Alert>
		);
	}

	return (
		<div>
			<Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
				Welcome, {currentUser.username}!
			</Typography>

			<Typography variant="h6" gutterBottom>
				Available Problems
			</Typography>

			<Select
				id="problem-type-filter"
				fullWidth
				variant="outlined"
				onChange={(e) => handleTypeChange(e.target.value)}
				defaultValue="all"
				sx={{ mb: 2 }}
			>
				<MenuItem value="all">ALL</MenuItem>
				<MenuItem value="gen">gen</MenuItem>
				<MenuItem value="NumberGen">NumberGen</MenuItem>
				<MenuItem value="Qna">Qna</MenuItem>
			</Select>

			{filteredProblems.length === 0 ? (
				<Alert severity="info">No problems available for the selected type.</Alert>
			) : (
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Title</TableCell>
								<TableCell>Type</TableCell>
								<TableCell>Solving rate</TableCell>
								<TableCell>Enter</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{filteredProblems.map((problem, index) => (
								<ProblemItem key={problem._id || index} problem={problem} />
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</div>
	);
};

export default HomeScreen;
