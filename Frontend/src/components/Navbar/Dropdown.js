import React, { useState } from 'react';
import { serviceDropdown } from './NavItems';
import { Link } from 'react-router-dom';
import { Menu, MenuItem } from '@mui/material';

function Dropdown() {
	const [anchorEl, setAnchorEl] = useState(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
				{serviceDropdown.map((item) => {
					return (
						<MenuItem key={item.id} onClick={handleClose}>
							<Link to={item.path} className={item.cName}>
								{item.title}
							</Link>
						</MenuItem>
					);
				})}
			</Menu>
			<button onClick={handleClick}>Open Menu</button>
		</>
	);
}

export default Dropdown;
