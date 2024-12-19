import React, { useEffect, useState } from 'react';
import { TableRow, TableCell, Button } from '@mui/material';
import authService from '../../services/auth.service';
import genProblemService from '../../services/gen-problem.service';

export default function Prob({ prob }) {
	const currentUser = authService.getCurrentUser();
	const [stateProb, setStateProb] = useState('white');
	const [inOut, setInOut] = useState([]);
	const [inOutProb, setInOutProb] = useState([]);
	const [Acceptance, setAcceptance] = useState('Not played yet');

	const getGenProbs = async () => {
		const inOutlocal = genProblemService.GetGenProb(currentUser.id, prob._id);
		setInOut(await inOutlocal);
	};

	const GetInOutProb = async () => {
		const inOutProbLocal = genProblemService.GetAllGenProbByProb(prob._id);
		setInOutProb(await inOutProbLocal);
	};

	useEffect(() => {
		if (inOutProb.data && inOutProb.data.length !== 0) {
			let accepted = 0;
			let allEntered = inOutProb.data.length;
			inOutProb.data.forEach((inOut) => {
				if (inOut.answered) {
					accepted++;
				}
			});
			setAcceptance(`${Math.round((accepted / allEntered) * 100)}%`);
		}
	}, [inOutProb]);

	useEffect(() => {
		if (inOut.data) {
			setStateProb(inOut.data.answered ? 'bg-success' : 'table-active');
		}
	}, [inOut]);

	useEffect(() => {
		getGenProbs();
		GetInOutProb();
	}, []);

	return (
		<TableRow className={stateProb + ' rounded'}>
			<TableCell>{prob.title}</TableCell>
			<TableCell>{prob.type}</TableCell>
			<TableCell>{Acceptance}</TableCell>
			<TableCell>
				<Button
					variant="outlined"
					color={stateProb !== 'bg-success' ? 'primary' : 'default'}
					href={'/ProbNumberGen/' + prob._id}
				>
					Enter
				</Button>
			</TableCell>
		</TableRow>
	);
}
