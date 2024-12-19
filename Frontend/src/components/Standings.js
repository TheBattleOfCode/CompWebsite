import React, { useEffect, useState } from 'react';
import authService from '../services/auth.service';
import countryService from '../services/country.service';
import userService from '../services/user.service';
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
} from '@mui/material';
import { FaSort } from 'react-icons/fa';

const Standings = () => {
	const currentUser = authService.getCurrentUser();
	const [users, setUsers] = useState([]);
	const [filtredUsers, setFiltredUsers] = useState([]);
	const [countries, setCountries] = useState([]);
	const [countryFilter, setCountryFilter] = useState('');
	const [loading, setLoading] = useState(false);
	const [sortBy, setSortBy] = useState(['score', true]);
	const idAdmin = '619a62a8e8934539f45022c9';

	//get countries from api
	const getCountries = async () => {
		const countriesLocal = await countryService.GetAllCounties();
		setCountries(countriesLocal.data.sort((c1, c2) => c1.name.common.localeCompare(c2.name.common)));
		localStorage.setItem(
			'countries',
			JSON.stringify(countriesLocal.data.sort((c1, c2) => c1.name.common.localeCompare(c2.name.common))),
		);
	};

	const getCountryImage = (name) => {
		let country = countries.filter((country) => country.name.common === name);

		return country.length ? country[0].flags.png : 'https://flagcdn.com/w320/uy.png';
	};

	const getUser = async () => {
		const Userdata = await userService.getUsers();
		const usersLocal = Userdata.data
			.filter((user) => !user.roles.includes(idAdmin) || currentUser.roles.includes('ROLE_ADMIN'))
			.sort((a, b) => b.indivScore - a.indivScore);
		setUsers(usersLocal);
		setFiltredUsers(usersLocal);
		users.sort((a, b) => b.indivScore - a.indivScore);
	};

	useEffect(() => {
		console.log(sortBy);
		let filterLocal = filtredUsers;
		switch (sortBy[0]) {
			/*case "org":
        filterLocal =filtredUsers.sort((a, b) => b.country.localeCompare(a.country)));
        break;*/
			case 'username':
				filterLocal = filtredUsers.sort((a, b) => b.username.localeCompare(a.username)).slice();
				break;
			case 'bonus':
				filterLocal = filtredUsers.sort((a, b) => b.bonus - a.bonus).slice();
				break;
			case 'score':
				filterLocal = filtredUsers.sort((a, b) => b.indivScore - a.indivScore).slice();
				break;
			case 'NbSolved':
				filterLocal = filtredUsers.sort((a, b) => b.countSolved - a.countSolved).slice();
				console.log(filtredUsers);
				break;
		}
		if (sortBy[1]) {
			setFiltredUsers(filterLocal.reverse());
		} else {
			setFiltredUsers(filterLocal);
		}
	}, [sortBy]);

	useEffect(() => {
		getUser();
	}, []);

	useEffect(() => {
		setLoading(true);
		if (localStorage.getItem('countries') !== null) {
			setCountries(JSON.parse(localStorage.getItem('countries')));
			setLoading(false);
		} else {
			getCountries().then(() => {
				setLoading(false);
			});
		}
	}, []);

	useEffect(() => {
		if (countryFilter == 'N/A') {
			setFiltredUsers(users);
		} else {
			setFiltredUsers(users.filter((ers) => ers.country == countryFilter));
		}
	}, [countryFilter]);

	return (
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>#</TableCell>
						<TableCell>
							<FormControl fullWidth>
								<InputLabel>Country</InputLabel>
								<Select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)}>
									<MenuItem value="N/A">Country (All)</MenuItem>
									<MenuItem value={currentUser.country || 'Uruguay'}>Same as me</MenuItem>
									{countries.map((country, index) => (
										<MenuItem key={index} value={country.name.common}>
											{country.name.common}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</TableCell>
						<TableCell>
							<FaSort onClick={() => setSortBy(['org', sortBy[0] !== 'org' ? true : !sortBy[1]])} />{' '}
							Organization
						</TableCell>
						<TableCell>
							<FaSort
								onClick={() => setSortBy(['username', sortBy[0] !== 'username' ? true : !sortBy[1]])}
							/>{' '}
							Username
						</TableCell>
						<TableCell>Firstname</TableCell>
						<TableCell>Lastname</TableCell>
						<TableCell>Team name</TableCell>
						<TableCell>
							<FaSort onClick={() => setSortBy(['bonus', sortBy[0] !== 'bonus' ? true : !sortBy[1]])} />{' '}
							Bonus
						</TableCell>
						<TableCell>
							<FaSort onClick={() => setSortBy(['score', sortBy[0] !== 'score' ? true : !sortBy[1]])} />{' '}
							Score
						</TableCell>
						<TableCell>
							<FaSort
								onClick={() => setSortBy(['NbSolved', sortBy[0] !== 'NbSolved' ? true : !sortBy[1]])}
							/>{' '}
							Solved problems
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{filtredUsers.map((user, index) => (
						<TableRow key={index} className={currentUser.id === user._id ? 'table-active' : ''}>
							<TableCell>{index + 1}</TableCell>
							<TableCell>
								{loading ? (
									<CircularProgress size={24} />
								) : (
									<img className="flag" src={getCountryImage(user.country)} alt="flag" />
								)}{' '}
								{user.country || 'ffdv'}
							</TableCell>
							<TableCell>
								{user.roles.includes(idAdmin) ? (
									<span className="badge badge-danger">Admin</span>
								) : (
									user.organization
								)}
							</TableCell>
							<TableCell>{user.username}</TableCell>
							<TableCell>{user.firstName}</TableCell>
							<TableCell>{user.lastName}</TableCell>
							<TableCell>{user.teamName}</TableCell>
							<TableCell>0</TableCell>
							<TableCell>{user.indivScore}</TableCell>
							<TableCell>{user.countSolved}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default Standings;
