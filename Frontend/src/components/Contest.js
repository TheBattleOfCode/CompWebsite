import React from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	TextField,
	Button,
} from '@mui/material';

const Contest = () => {
	return (
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Competition</TableCell>
						<TableCell>Start</TableCell>
						<TableCell>End</TableCell>
						<TableCell>Number of problems</TableCell>
						<TableCell>Passcode</TableCell>
						<TableCell></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						<TableCell>First Competition</TableCell>
						<TableCell>15/02/2021 15:45</TableCell>
						<TableCell>15/02/2021 18:45</TableCell>
						<TableCell>5</TableCell>
						<TableCell>
							<TextField defaultValue="code" />
						</TableCell>
						<TableCell>
							<Button variant="contained">Enter</Button>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Second Competition no passcode</TableCell>
						<TableCell>15/02/2021 15:45</TableCell>
						<TableCell>15/02/2021 18:45</TableCell>
						<TableCell>7</TableCell>
						<TableCell>
							<TextField />
						</TableCell>
						<TableCell>
							<Button variant="contained">Enter</Button>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Third Competition</TableCell>
						<TableCell>15/02/2021 15:45</TableCell>
						<TableCell>15/02/2021 18:45</TableCell>
						<TableCell>5</TableCell>
						<TableCell>
							<TextField />
						</TableCell>
						<TableCell>
							<Button variant="contained">Enter</Button>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Fourth Competition</TableCell>
						<TableCell>15/02/2021 15:45</TableCell>
						<TableCell>15/02/2021 18:45</TableCell>
						<TableCell>5</TableCell>
						<TableCell>
							<TextField />
						</TableCell>
						<TableCell>
							<Button variant="contained">Enter</Button>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default Contest;
