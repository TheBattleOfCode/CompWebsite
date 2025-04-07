import CodeIcon from '@mui/icons-material/Code';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
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
	FormControl,
	InputLabel,
	Card,
	CardContent,
	Grid,
	Chip,
	Divider,
	useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { selectCurrentUser } from '../../features/auth/authSlice';
import { useGetProblemsQuery } from '../../services/api';

import ProblemItem from './ProblemItem.jsx';
import { filterProblemsByType } from './utils';

const HomeScreen = () => {
	const [problemType, setProblemType] = useState('all');
	const currentUser = useSelector(selectCurrentUser);
	const theme = useTheme();

	// Fetch problems using RTK Query
	const { data: problems = [], isLoading, error } = useGetProblemsQuery();

	// Filter problems based on selected type
	const filteredProblems = filterProblemsByType(problems, problemType);

	const handleTypeChange = (event) => {
		setProblemType(event.target.value);
	};

	if (isLoading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
				<CircularProgress size={60} thickness={4} />
			</Box>
		);
	}

	if (error) {
		return (
			<Alert
				severity="error"
				sx={{
					mt: 2,
					borderRadius: 2,
					boxShadow: 3,
				}}
				variant="filled"
			>
				Failed to load problems. Please try again later.
			</Alert>
		);
	}

	return (
		<Box sx={{ pb: 6 }}>
			<Grid container spacing={4}>
				{/* Welcome Card */}
				<Grid item xs={12} md={6}>
					<Card
						sx={{
							height: '100%',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							p: 2,
							background:
								theme.palette.mode === 'dark'
									? 'linear-gradient(45deg, #303030 30%, #424242 90%)'
									: 'linear-gradient(45deg, #f5f5f5 30%, #e0e0e0 90%)',
							boxShadow: 4,
						}}
					>
						<CardContent>
							<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
								<EmojiEventsIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
								<Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
									Welcome, {currentUser.username}!
								</Typography>
							</Box>
							<Typography variant="body1" color="text.secondary" paragraph>
								Ready to sharpen your coding skills? Browse through our collection of problems and start
								solving!
							</Typography>
							<Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
								<Chip
									label="Coding Challenges"
									color="primary"
									variant="outlined"
									icon={<CodeIcon />}
								/>
								<Chip label="Compete" color="secondary" variant="outlined" icon={<EmojiEventsIcon />} />
								<Chip label="Learn" color="success" variant="outlined" />
							</Box>
						</CardContent>
					</Card>
				</Grid>

				{/* Problems Card */}
				<Grid item xs={12} md={6}>
					<Card sx={{ height: '100%', boxShadow: 4 }}>
						<CardContent>
							<Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
								Your Progress
							</Typography>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
								<Box sx={{ textAlign: 'center' }}>
									<Typography variant="h4" color="primary.main">
										{problems.length}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Total Problems
									</Typography>
								</Box>
								<Divider orientation="vertical" flexItem />
								<Box sx={{ textAlign: 'center' }}>
									<Typography variant="h4" color="success.main">
										{Math.floor(Math.random() * problems.length)}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Solved
									</Typography>
								</Box>
								<Divider orientation="vertical" flexItem />
								<Box sx={{ textAlign: 'center' }}>
									<Typography variant="h4" color="secondary.main">
										{Math.floor(Math.random() * 100)}%
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Success Rate
									</Typography>
								</Box>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			<Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>
				Available Problems
			</Typography>

			<FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
				<InputLabel id="problem-type-filter-label">Filter by Type</InputLabel>
				<Select
					labelId="problem-type-filter-label"
					id="problem-type-filter"
					value={problemType}
					onChange={handleTypeChange}
					label="Filter by Type"
				>
					<MenuItem value="all">All Types</MenuItem>
					<MenuItem value="gen">General</MenuItem>
					<MenuItem value="NumberGen">Number Generator</MenuItem>
					<MenuItem value="Qna">Q&A</MenuItem>
				</Select>
			</FormControl>

			{filteredProblems.length === 0 ? (
				<Alert
					severity="info"
					sx={{
						borderRadius: 2,
						boxShadow: 2,
					}}
				>
					No problems available for the selected type.
				</Alert>
			) : (
				<TableContainer
					component={Paper}
					sx={{
						borderRadius: 2,
						boxShadow: 3,
						overflow: 'hidden',
					}}
				>
					<Table>
						<TableHead sx={{ bgcolor: 'primary.main' }}>
							<TableRow>
								<TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Title</TableCell>
								<TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
								<TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Solving rate</TableCell>
								<TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
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
		</Box>
	);
};

export default HomeScreen;
