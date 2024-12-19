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
	Button,
} from '@mui/material';
import authService from '../../services/auth.service';
import probService from '../../services/prob.service';
import Prob from './Probs';

const Homescreen = () => {
	const currentUser = authService.getCurrentUser();

	const [probs, setProbs] = useState([]);
	const [filtredProbs, setFiltredProbs] = useState([]);

	const getData = async () => {
		const data = await probService.GetProbs();
		setProbs(data.data);
		setFiltredProbs(data.data);
	};

	const sortByType = (type) => {
		if (type === 'all') {
			setFiltredProbs(probs);
		} else {
			const sortedProbs = probs.filter((prob) => prob.type === type);
			setFiltredProbs(sortedProbs);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	return (
		<div>
			<Select
				id="dropdown"
				fullWidth
				variant="outlined"
				onChange={(e) => sortByType(e.target.value)}
				defaultValue="all"
			>
				<MenuItem value="all">ALL</MenuItem>
				<MenuItem value="gen">gen</MenuItem>
				<MenuItem value="NumberGen">NumberGen</MenuItem>
				<MenuItem value="Qna">Qna</MenuItem>
			</Select>

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
						{filtredProbs.map((prob, index) => (
							<Prob key={index} prob={prob} />
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};

export default Homescreen;
