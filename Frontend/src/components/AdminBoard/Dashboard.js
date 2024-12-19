import { useEffect, useState } from 'react';
import {
	Container,
	Card,
	CardContent,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	CircularProgress,
} from '@mui/material';
import PieChart from './PieChart';
import userService from '../../services/user.service';
import probService from '../../services/prob.service';

const Dashboard = () => {
	const [admins, setAdmins] = useState([]);
	const [uniqueCountry, setuniqueCountry] = useState([]);
	const [problems, setProblems] = useState([]);
	const [allUsers, setAllUsers] = useState([]);
	const [loading, setLoading] = useState(true);

	const getAdmin = async () => {
		const Userdata = await userService.getUsers();
		setAdmins(Userdata.data.filter((user) => user.roles.includes('619a62a8e8934539f45022c9')));
	};

	const getUniqueCountry = async () => {
		const Userdata = await userService.getUsers();
		const country = Userdata.data.map((user) => user.country);
		const uniqueCountry = [...new Set(country)];
		setuniqueCountry(uniqueCountry);
	};

	const getProblems = async () => {
		const probsdata = await probService.GetProbs();
		setProblems(probsdata.data);
	};

	const getAllUsers = async () => {
		const Userdata = await userService.getUsers();
		setAllUsers(Userdata.data);
	};

	useEffect(() => {
		Promise.all([getAdmin(), getUniqueCountry(), getProblems(), getAllUsers()]).then(() => setLoading(false));
	}, []);

	if (loading) {
		return <CircularProgress />;
	}

	return (
		<Container>
			<Typography variant="h4" gutterBottom>
				Admin Board
			</Typography>
			<Typography variant="h5" gutterBottom>
				Stats
			</Typography>
			<div className="row mb-3">
				<Card sx={{ margin: 2, padding: 2, backgroundColor: '#57b960', color: 'white' }}>
					<CardContent>
						<Typography variant="h6">Users</Typography>
						<Typography variant="h3">{allUsers.length}</Typography>
					</CardContent>
				</Card>
				<Card sx={{ margin: 2, padding: 2, backgroundColor: '#dc3545', color: 'white' }}>
					<CardContent>
						<Typography variant="h6">Problems</Typography>
						<Typography variant="h3">{problems.length}</Typography>
					</CardContent>
				</Card>
				<Card sx={{ margin: 2, padding: 2, backgroundColor: '#17a2b8', color: 'white' }}>
					<CardContent>
						<Typography variant="h6">Countries</Typography>
						<Typography variant="h3">{uniqueCountry.length}</Typography>
					</CardContent>
				</Card>
				<Card sx={{ margin: 2, padding: 2, backgroundColor: '#ffc107', color: 'white' }}>
					<CardContent>
						<Typography variant="h6">Admins</Typography>
						<Typography variant="h3">{admins.length}</Typography>
					</CardContent>
				</Card>
			</div>
			<Typography variant="h5" gutterBottom>
				Our Admins
			</Typography>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>No</TableCell>
						<TableCell>Name</TableCell>
						<TableCell>Email</TableCell>
						<TableCell>Phone</TableCell>
						<TableCell>Country</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{admins.map((admin, index) => (
						<TableRow key={index}>
							<TableCell>{index + 1}</TableCell>
							<TableCell>{admin.username}</TableCell>
							<TableCell>{admin.email}</TableCell>
							<TableCell>{admin.phone}</TableCell>
							<TableCell>{admin.country}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<PieChart />
			<Typography variant="h5" gutterBottom>
				The newest 4 users
			</Typography>
			<div className="card-deck">
				{allUsers.slice(allUsers.length - 4, allUsers.length).map((user, index) => (
					<Card key={index} sx={{ margin: 2, padding: 2 }}>
						<CardContent>
							<img
								src="https://bootdey.com/img/Content/avatar/avatar7.png"
								alt="Admin"
								className="rounded-circle"
								width="80"
							/>
							<Typography variant="h6">{user.username}</Typography>
							<Typography>{user.email}</Typography>
							<Typography>{user.phone}</Typography>
							<Typography>{user.country}</Typography>
						</CardContent>
					</Card>
				))}
			</div>
		</Container>
	);
};

export default Dashboard;
