import React, { useEffect, useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	CircularProgress,
	Container,
	Typography,
} from '@mui/material';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import authService from '../../services/auth.service';
import countryService from '../../services/country.service';
import userService from '../../services/user.service';
import { fetchUsers, fetchCountries, sortUsers, filterUsersByCountry } from './utils';
import './styles.css';

const Standings = () => {
	const currentUser = authService.getCurrentUser();
	const [users, setUsers] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [countries, setCountries] = useState([]);
	const [countryFilter, setCountryFilter] = useState('');
	const [loading, setLoading] = useState(false);
	const [sortConfig, setSortConfig] = useState({ key: 'indivScore', direction: 'desc' });

	// Admin ID for special handling
	const ADMIN_ID = '619a62a8e8934539f45022c9';

	// Load users and countries on component mount
	useEffect(() => {
		const loadData = async () => {
			setLoading(true);

			try {
				// Fetch users
				const usersData = await fetchUsers(userService);
				setUsers(usersData);
				setFilteredUsers(usersData);

				// Fetch countries
				const countriesData = await fetchCountries(countryService);
				setCountries(countriesData);
			} catch (error) {
				console.error('Error loading data:', error);
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, []);

	// Handle sorting
	const handleSort = (key) => {
		const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';

		setSortConfig({ key, direction });

		const sortedUsers = sortUsers(filteredUsers, key, direction);
		setFilteredUsers(sortedUsers);
	};

	// Handle country filter change
	const handleCountryFilterChange = (event) => {
		const country = event.target.value;
		setCountryFilter(country);

		const filtered = filterUsersByCountry(users, country);
		setFilteredUsers(filtered);
	};

	// Get sort icon based on current sort configuration
	const getSortIcon = (key) => {
		if (sortConfig.key !== key) return <FaSort />;
		return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
	};

	return (
		<Container>
			<Typography variant="h4" gutterBottom>
				Standings
			</Typography>

			{loading ? (
				<div className="loading-container">
					<CircularProgress />
				</div>
			) : (
				<>
					{/* Country Filter */}
					<FormControl variant="outlined" fullWidth margin="normal">
						<InputLabel id="country-filter-label">Filter by Country</InputLabel>
						<Select
							labelId="country-filter-label"
							value={countryFilter}
							onChange={handleCountryFilterChange}
							label="Filter by Country"
						>
							<MenuItem value="">All Countries</MenuItem>
							{countries.map((country, index) => (
								<MenuItem key={index} value={country.name.common}>
									{country.name.common}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					{/* Users Table */}
					<TableContainer component={Paper}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Rank</TableCell>
									<TableCell onClick={() => handleSort('username')} className="sortable-header">
										Username {getSortIcon('username')}
									</TableCell>
									<TableCell onClick={() => handleSort('indivScore')} className="sortable-header">
										Score {getSortIcon('indivScore')}
									</TableCell>
									<TableCell onClick={() => handleSort('country')} className="sortable-header">
										Country {getSortIcon('country')}
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{filteredUsers.map((user, index) => (
									<TableRow
										key={user._id}
										className={user._id === currentUser?.id ? 'current-user-row' : ''}
									>
										<TableCell>{index + 1}</TableCell>
										<TableCell>
											{user._id === ADMIN_ID ? (
												<span className="admin-user">{user.username}</span>
											) : (
												user.username
											)}
										</TableCell>
										<TableCell>{user.indivScore}</TableCell>
										<TableCell>{user.country || 'N/A'}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</>
			)}
		</Container>
	);
};

export default Standings;
