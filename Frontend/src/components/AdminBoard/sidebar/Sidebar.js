import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Avatar, Typography } from '@mui/material';
import { Person, BarChart, People, InsertChart } from '@mui/icons-material';
import authService from '../../../services/auth.service';

const Sidebar = () => {
	const currentUser = authService.getCurrentUser();
	const [userName, setUserName] = React.useState(currentUser.username);

	return (
		<div style={{ backgroundColor: '#1b1919', height: '100vh', padding: '20px' }}>
			<Avatar
				src="https://bootdey.com/img/Content/avatar/avatar1.png"
				alt="Admin"
				sx={{ width: 100, height: 100, margin: '0 auto' }}
			/>
			<Typography variant="h5" color="white" align="center" sx={{ marginTop: 2 }}>
				{userName}
			</Typography>
			<List>
				<ListItem button>
					<ListItemIcon>
						<Person style={{ color: 'white' }} />
					</ListItemIcon>
					<ListItemText primary="Stats" style={{ color: 'white' }} />
				</ListItem>
				<ListItem button>
					<ListItemIcon>
						<People style={{ color: 'white' }} />
					</ListItemIcon>
					<ListItemText primary="Admins" style={{ color: 'white' }} />
				</ListItem>
				<ListItem button>
					<ListItemIcon>
						<BarChart style={{ color: 'white' }} />
					</ListItemIcon>
					<ListItemText primary="Data" style={{ color: 'white' }} />
				</ListItem>
				<ListItem button>
					<ListItemIcon>
						<InsertChart style={{ color: 'white' }} />
					</ListItemIcon>
					<ListItemText primary="Users" style={{ color: 'white' }} />
				</ListItem>
			</List>
		</div>
	);
};

export default Sidebar;
