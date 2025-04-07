import {
	Container,
	Card,
	CardContent,
	Typography,
	TextField,
	Button,
	Select,
	MenuItem,
	Alert,
	CircularProgress,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import AuthService from '../../services/auth.service';
import countryService from '../../services/country.service';
import userService from '../../services/user.service';

import { encodeImageFileAsURL } from './utils';
import './styles.css';

const Profile = () => {
	const currentUser = AuthService.getCurrentUser();
	const [countries, setCountries] = useState([]);
	const [editMode, setEditMode] = useState(false);
	const [firstName, setFirstName] = useState(currentUser.firstName);
	const [lastName, setLastName] = useState(currentUser.lastName);
	const [phone, setPhone] = useState(currentUser.phone);
	const [city, setCity] = useState(currentUser.city);
	const [country, setCountry] = useState(currentUser.country);
	const [profilePicture, setProfilePicture] = useState(currentUser.profilePicture);
	const [successful, setSuccessful] = useState(false);
	const [message, setMessage] = useState('');
	const [loading, setLoading] = useState(false);
	const [editImage, setEditImage] = useState(false);
	const [uploadName, setUploadName] = useState('');

	const toggleEditMode = () => {
		setEditMode(!editMode);
		setSuccessful(false);
		setMessage('');
	};

	const cancelEdit = () => {
		setEditMode(false);
		setMessage('Profile update canceled');
		setSuccessful(false);
	};

	const saveProfile = () => {
		setLoading(true);

		const updatedUserData = {
			firstName,
			lastName,
			phone,
			city,
			country,
		};

		userService
			.UpdateUser(currentUser.id, updatedUserData)
			.then(() => {
				// Update local storage with new user data
				const updatedUser = {
					...currentUser,
					...updatedUserData,
					profilePicture,
				};

				localStorage.setItem('user', JSON.stringify(updatedUser));

				setEditMode(false);
				setSuccessful(true);
				setMessage('Profile updated successfully');
			})
			.catch((error) => {
				setSuccessful(false);
				setMessage('Error updating profile: ' + error.message);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const saveProfilePicture = () => {
		setLoading(true);

		userService
			.UpdateUser(currentUser.id, { profilePicture })
			.then(() => {
				// Update local storage with new profile picture
				const updatedUser = {
					...currentUser,
					profilePicture,
				};

				localStorage.setItem('user', JSON.stringify(updatedUser));

				setEditImage(false);
				setUploadName('');
				setSuccessful(true);
				setMessage('Profile picture updated successfully');
			})
			.catch((error) => {
				setSuccessful(false);
				setMessage('Error updating profile picture: ' + error.message);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const handleImageUpload = (element) => {
		encodeImageFileAsURL(element, currentUser.profilePicture, setProfilePicture, setUploadName);
	};

	const fetchCountries = async () => {
		setLoading(true);

		try {
			if (localStorage.getItem('countries') === null) {
				const response = await countryService.GetAllCounties();
				const sortedCountries = response.data.sort((a, b) => a.name.common.localeCompare(b.name.common));

				setCountries(sortedCountries);
				localStorage.setItem('countries', JSON.stringify(sortedCountries));
			} else {
				const cachedCountries = JSON.parse(localStorage.getItem('countries'));
				setCountries(cachedCountries);
			}
		} catch (error) {
			console.error('Error fetching countries:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCountries();
	}, []);

	return (
		<Container>
			<Card sx={{ marginTop: 2 }}>
				<CardContent>
					<Typography variant="h5">User Profile</Typography>

					{/* Profile Picture Section */}
					<div className="image_container">
						<img src={profilePicture} alt="Profile" className="rounded-circle profile_image" />
						{!editImage ? (
							<Button variant="contained" color="secondary" onClick={() => setEditImage(true)}>
								Change
							</Button>
						) : null}
					</div>

					{/* Profile Picture Edit Form */}
					{editImage && (
						<div className="form-group">
							<div className="mt-3">
								<Button variant="contained" component="label">
									Choose a file
									<input type="file" hidden onChange={(e) => handleImageUpload(e.target)} />
								</Button>
								<br />
								<Typography
									className={
										profilePicture === currentUser.profilePicture ? 'text-danger' : 'text-success'
									}
								>
									<strong>
										<em>{uploadName || 'No file chosen'}</em>
									</strong>
								</Typography>
								<br />
								<Button
									variant="contained"
									color="primary"
									onClick={saveProfilePicture}
									disabled={profilePicture === currentUser.profilePicture || loading}
								>
									{loading && <CircularProgress size={24} />}
									Save
								</Button>
								<Button
									variant="contained"
									color="error"
									onClick={() => {
										setProfilePicture(currentUser.profilePicture);
										setEditImage(false);
									}}
								>
									Cancel
								</Button>
							</div>
						</div>
					)}

					{/* User Info Section */}
					<div className="mt-3">
						<Typography variant="h6">{currentUser.username}</Typography>
						<Typography color="textSecondary">{currentUser.indivScore}</Typography>
						<Typography color="textSecondary">
							{currentUser.city || '--'}, {currentUser.country || '--'}
						</Typography>
						<Button variant="contained" color="primary">
							Follow
						</Button>
						<Button variant="outlined" color="primary">
							Message
						</Button>
					</div>

					{/* Full Name Section */}
					<div className="mt-3">
						<Typography variant="h6">Full Name</Typography>
						{editMode ? (
							<div className="row">
								<TextField
									label="First Name"
									variant="outlined"
									fullWidth
									margin="normal"
									value={firstName || ''}
									onChange={(e) => setFirstName(e.target.value)}
								/>
								<TextField
									label="Last Name"
									variant="outlined"
									fullWidth
									margin="normal"
									value={lastName || ''}
									onChange={(e) => setLastName(e.target.value)}
								/>
							</div>
						) : (
							<Typography color="textSecondary">
								{currentUser.firstName} {currentUser.lastName}
							</Typography>
						)}
					</div>

					{/* Email Section */}
					<div className="mt-3">
						<Typography variant="h6">Email</Typography>
						<Typography color="textSecondary">{currentUser.email}</Typography>
					</div>

					{/* Phone Section */}
					<div className="mt-3">
						<Typography variant="h6">Phone</Typography>
						{editMode ? (
							<TextField
								label="Phone"
								variant="outlined"
								fullWidth
								margin="normal"
								value={phone || ''}
								onChange={(e) => setPhone(e.target.value)}
							/>
						) : (
							<Typography color="textSecondary">{currentUser.phone || '--'}</Typography>
						)}
					</div>

					{/* Address Section */}
					<div className="mt-3">
						<Typography variant="h6">Address</Typography>
						{editMode ? (
							<div className="row">
								<Select
									value={country || ''}
									onChange={(e) => setCountry(e.target.value)}
									fullWidth
									variant="outlined"
									margin="normal"
								>
									{currentUser.country ? (
										<MenuItem value={currentUser.country}>{currentUser.country}</MenuItem>
									) : (
										<MenuItem value="">Select Country</MenuItem>
									)}
									{countries.map((country, index) => (
										<MenuItem key={index} value={country.name.common}>
											{country.name.common}
										</MenuItem>
									))}
								</Select>
								<TextField
									label="City"
									variant="outlined"
									fullWidth
									margin="normal"
									value={city || ''}
									onChange={(e) => setCity(e.target.value)}
								/>
							</div>
						) : (
							<Typography color="textSecondary">
								{currentUser.city || '--'}, {currentUser.country || '--'}
							</Typography>
						)}
					</div>

					{/* Action Buttons */}
					<div className="mt-3">
						{!editMode ? (
							<Button variant="contained" color="primary" onClick={toggleEditMode} disabled={loading}>
								{loading && <CircularProgress size={24} />}
								Edit
							</Button>
						) : (
							<Button variant="outlined" color="primary" onClick={cancelEdit} disabled={loading}>
								{loading && <CircularProgress size={24} />}
								Cancel
							</Button>
						)}

						{editMode && (
							<Button variant="contained" color="success" onClick={saveProfile} disabled={loading}>
								{loading && <CircularProgress size={24} />}
								Save
							</Button>
						)}

						{message && <Alert severity={successful ? 'success' : 'error'}>{message}</Alert>}
					</div>
				</CardContent>
			</Card>
		</Container>
	);
};

export default Profile;
