import React, { useState, useEffect } from 'react';
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
import { useSelector } from 'react-redux';
import { useGetCountriesQuery, useUpdateUserMutation } from '../../services';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { encodeImageFileAsURL } from './utils';
import './styles.css';

const Profile = () => {
	// Get current user from Redux store
	const currentUser = useSelector(selectCurrentUser);

	// RTK Query hooks
	const { data: countries = [] } = useGetCountriesQuery();
	const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

	// Local state
	const [editMode, setEditMode] = useState(false);
	const [firstName, setFirstName] = useState(currentUser?.firstName || '');
	const [lastName, setLastName] = useState(currentUser?.lastName || '');
	const [phone, setPhone] = useState(currentUser?.phone || '');
	const [city, setCity] = useState(currentUser?.city || '');
	const [country, setCountry] = useState(currentUser?.country || '');
	const [profilePicture, setProfilePicture] = useState(
		currentUser?.profilePicture || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
	);
	const [successful, setSuccessful] = useState(false);
	const [message, setMessage] = useState('');
	const [loading, setLoading] = useState(false);
	const [editImage, setEditImage] = useState(false);
	const [uploadName, setUploadName] = useState('');

	// Update local state when currentUser changes
	useEffect(() => {
		if (currentUser) {
			setFirstName(currentUser.firstName || '');
			setLastName(currentUser.lastName || '');
			setPhone(currentUser.phone || '');
			setCity(currentUser.city || '');
			setCountry(currentUser.country || '');
			setProfilePicture(
				currentUser.profilePicture ||
					'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
			);
		}
	}, [currentUser]);

	const toggleEditMode = () => {
		setEditMode(!editMode);
		setSuccessful(false);
		setMessage('');
	};

	const cancelEdit = () => {
		setEditMode(false);
		setMessage('Profile update canceled');
		setSuccessful(false);

		// Reset form values to current user values
		if (currentUser) {
			setFirstName(currentUser.firstName || '');
			setLastName(currentUser.lastName || '');
			setPhone(currentUser.phone || '');
			setCity(currentUser.city || '');
			setCountry(currentUser.country || '');
		}
	};

	const saveProfile = async () => {
		setLoading(true);

		const updatedUserData = {
			firstName,
			lastName,
			phone,
			city,
			country,
		};

		try {
			// Update user using RTK Query mutation
			await updateUser({
				id: currentUser.id,
				data: updatedUserData,
			}).unwrap();

			// Update local storage with new user data
			try {
				const storedUser = JSON.parse(localStorage.getItem('user'));
				if (storedUser) {
					const updatedUser = {
						...storedUser,
						...updatedUserData,
						profilePicture,
					};
					localStorage.setItem('user', JSON.stringify(updatedUser));
				}
			} catch (error) {
				console.error('Error updating user in localStorage:', error);
			}

			setEditMode(false);
			setSuccessful(true);
			setMessage('Profile updated successfully');
		} catch (error) {
			setSuccessful(false);
			setMessage('Error updating profile: ' + (error.data?.message || error.error || 'Unknown error'));
		} finally {
			setLoading(false);
		}
	};

	const saveProfilePicture = async () => {
		setLoading(true);

		try {
			// Update user profile picture using RTK Query mutation
			await updateUser({
				id: currentUser.id,
				data: { profilePicture },
			}).unwrap();

			// Update local storage with new profile picture
			try {
				const storedUser = JSON.parse(localStorage.getItem('user'));
				if (storedUser) {
					const updatedUser = {
						...storedUser,
						profilePicture,
					};
					localStorage.setItem('user', JSON.stringify(updatedUser));
				}
			} catch (error) {
				console.error('Error updating profile picture in localStorage:', error);
			}

			setEditImage(false);
			setUploadName('');
			setSuccessful(true);
			setMessage('Profile picture updated successfully');
		} catch (error) {
			setSuccessful(false);
			setMessage('Error updating profile picture: ' + (error.data?.message || error.error || 'Unknown error'));
		} finally {
			setLoading(false);
		}
	};

	const handleImageUpload = (element) => {
		encodeImageFileAsURL(element, currentUser.profilePicture, setProfilePicture, setUploadName);
	};

	// If no user is logged in, show a message
	if (!currentUser) {
		return (
			<Container>
				<Alert severity="warning">Please log in to view your profile.</Alert>
			</Container>
		);
	}

	// Sort countries alphabetically
	const sortedCountries = [...countries].sort((a, b) => a.name?.common?.localeCompare(b.name?.common));

	return (
		<Container>
			<Card sx={{ marginTop: 2 }}>
				<CardContent>
					<Typography variant="h5">User Profile</Typography>

					{/* Profile Picture Section */}
					<div className="image_container">
						<img src={profilePicture} alt="Profile" className="rounded-circle profile_image" />
						{editImage ? null : (
							<Button variant="contained" color="secondary" onClick={() => setEditImage(true)}>
								Change
							</Button>
						)}
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
									disabled={profilePicture === currentUser.profilePicture || loading || isUpdating}
								>
									{(loading || isUpdating) && <CircularProgress size={24} />}
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
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
								/>
								<TextField
									label="Last Name"
									variant="outlined"
									fullWidth
									margin="normal"
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
								/>
							</div>
						) : (
							<Typography color="textSecondary">
								{currentUser.firstName || '--'} {currentUser.lastName || '--'}
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
								value={phone}
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
									value={country}
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
									{sortedCountries.map((country, index) => (
										<MenuItem key={index} value={country.name?.common}>
											{country.name?.common}
										</MenuItem>
									))}
								</Select>
								<TextField
									label="City"
									variant="outlined"
									fullWidth
									margin="normal"
									value={city}
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
						{editMode ? (
							<Button
								variant="outlined"
								color="primary"
								onClick={cancelEdit}
								disabled={loading || isUpdating}
							>
								{(loading || isUpdating) && <CircularProgress size={24} />}
								Cancel
							</Button>
						) : (
							<Button
								variant="contained"
								color="primary"
								onClick={toggleEditMode}
								disabled={loading || isUpdating}
							>
								{(loading || isUpdating) && <CircularProgress size={24} />}
								Edit
							</Button>
						)}

						{editMode && (
							<Button
								variant="contained"
								color="success"
								onClick={saveProfile}
								disabled={loading || isUpdating}
							>
								{(loading || isUpdating) && <CircularProgress size={24} />}
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
