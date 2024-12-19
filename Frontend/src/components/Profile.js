import React, { useEffect, useState } from 'react';
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
import AuthService from '../services/auth.service';
import countryService from '../services/country.service';
import userService from '../services/user.service';
import './Profile.css';

const Profile = () => {
	const currentUser = AuthService.getCurrentUser();
	const [countries, setCountries] = useState([]);
	const [editMsg, setEditMsg] = useState(false);
	const [firstName, setFirstName] = useState(currentUser.firstName);
	const [lastName, setLastName] = useState(currentUser.lastName);
	const [phone, setPhone] = useState(currentUser.phone);
	const [city, setCity] = useState(currentUser.city);
	const [country, setCountry] = useState(currentUser.country);
	const [profilePicture, setProfilePicture] = useState(currentUser.profilePicture);
	const [successful, setSuccessful] = useState(false);
	const [message, setMessage] = useState('');
	const [cancelMsg, setCancelMsg] = useState(false);
	const [loading, setLoading] = useState(false);
	const [editImage, setEditImage] = useState(false);
	const [uploadName, setUploadName] = useState('');

	const editProfile = () => {
		setEditMsg(!editMsg);
		setSuccessful(false);
		setCancelMsg(false);
	};

	const cancelEdit = () => {
		setEditMsg(!editMsg);
		setCancelMsg(!cancelMsg);
		setMessage(false);
	};

	const saveProfile = () => {
		setLoading(true);
		userService
			.UpdateUser(currentUser.id, {
				firstName: firstName,
				lastName: lastName,
				phone: phone,
				city: city,
				country: country,
			})
			.then((response) => {
				if (editMsg) {
					setEditMsg(!editMsg);
				}
				setLoading(false);
				setSuccessful(true);
			});

		currentUser.firstName = firstName;
		currentUser.lastName = lastName;
		currentUser.phone = phone;
		currentUser.city = city;
		currentUser.country = country;
		currentUser.profilePicture = profilePicture;

		localStorage.setItem('user', JSON.stringify(currentUser));
	};

	const saveProfilePicture = () => {
		setLoading(true);
		userService.UpdateUser(currentUser.id, { profilePicture: profilePicture }).then((response) => {
			if (editImage) {
				setEditImage(!editImage);
			}
			setLoading(false);
		});
		currentUser.profilePicture = profilePicture;
		localStorage.setItem('user', JSON.stringify(currentUser));
		setUploadName('');
	};

	const getCountries = async () => {
		if (localStorage.getItem('countries') === null) {
			const countriesLocal = await countryService.GetAllCounties();
			setCountries(countriesLocal.data.sort((c1, c2) => c1.name.common.localeCompare(c2.name.common)));
			localStorage.setItem(
				'countries',
				JSON.stringify(countriesLocal.data.sort((c1, c2) => c1.name.common.localeCompare(c2.name.common))),
			);
		} else {
			const countries = JSON.parse(localStorage.getItem('countries'));
			setCountries(countries);
		}
	};

	function encodeImageFileAsURL(element) {
		var file = element.files[0];
		var reader = new FileReader();
		reader.onloadend = function () {
			if (reader.result.length > 100000) {
				alert(
					'Image size is too big\nMax size is 100kb\nYour image size is ' +
						reader.result.length / 1000 +
						'kb',
				);
			} else {
				if (reader.result == currentUser.profilePicture) {
					setUploadName('You chose your old profile picture');
				} else {
					setUploadName(file.name);
				}
				setProfilePicture(reader.result);
			}
		};
		reader.readAsDataURL(file);
	}

	useEffect(() => {
		setLoading(true);
		getCountries().then(() => {
			setLoading(false);
		});
	}, []);

	const onChangeFirstName = (e) => {
		setFirstName(e.target.value);
	};

	const onChangeLastName = (e) => {
		setLastName(e.target.value);
	};

	const onChangePhone = (e) => {
		setPhone(e.target.value);
	};

	const onChangeCity = (e) => {
		setCity(e.target.value);
	};

	const onChangeCountry = (e) => {
		setCountry(e.target.value);
	};

	return (
		<Container>
			<Card sx={{ marginTop: 2 }}>
				<CardContent>
					<Typography variant="h5">User Profile</Typography>
					<div className="image_container">
						<img src={profilePicture} alt="Admin" className="rounded-circle profile_image" />
						{!editImage ? (
							<Button variant="contained" color="secondary" onClick={() => setEditImage(!editImage)}>
								Change
							</Button>
						) : null}
					</div>
					{editImage && (
						<div className="form-group">
							<div className="mt-3">
								<Button variant="contained" component="label">
									Choose a file
									<input type="file" hidden onChange={(e) => encodeImageFileAsURL(e.target)} />
								</Button>
								<br />
								<Typography
									className={
										profilePicture == currentUser.profilePicture ? 'text-danger' : 'text-success'
									}
								>
									<strong>
										<em>{uploadName ? uploadName : 'No file chosen'}</em>
									</strong>
								</Typography>
								<br />
								<Button
									variant="contained"
									color="primary"
									onClick={() => saveProfilePicture()}
									disabled={profilePicture == currentUser.profilePicture}
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
					<div className="mt-3">
						<Typography variant="h6">{currentUser.username}</Typography>
						<Typography color="textSecondary">{currentUser.indivScore}</Typography>
						<Typography color="textSecondary">
							{currentUser.city === null ? '--' : currentUser.city},{' '}
							{currentUser.country === null ? '--' : currentUser.country}
						</Typography>
						<Button variant="contained" color="primary">
							Follow
						</Button>
						<Button variant="outlined" color="primary">
							Message
						</Button>
					</div>
					<div className="mt-3">
						<Typography variant="h6">Full Name</Typography>
						{editMsg ? (
							<div className="row">
								<TextField
									label="First Name"
									variant="outlined"
									fullWidth
									margin="normal"
									value={firstName ? firstName : ''}
									onChange={onChangeFirstName}
								/>
								<TextField
									label="Last Name"
									variant="outlined"
									fullWidth
									margin="normal"
									value={lastName ? lastName : ''}
									onChange={onChangeLastName}
								/>
							</div>
						) : (
							<Typography color="textSecondary">
								{currentUser.firstName} {currentUser.lastName}
							</Typography>
						)}
					</div>
					<div className="mt-3">
						<Typography variant="h6">Email</Typography>
						<Typography color="textSecondary">{currentUser.email}</Typography>
					</div>
					<div className="mt-3">
						<Typography variant="h6">Phone</Typography>
						{editMsg ? (
							<TextField
								label="Phone"
								variant="outlined"
								fullWidth
								margin="normal"
								value={phone ? phone : ''}
								onChange={onChangePhone}
							/>
						) : (
							<Typography color="textSecondary">
								{currentUser.phone === null ? '--' : currentUser.phone}
							</Typography>
						)}
					</div>
					<div className="mt-3">
						<Typography variant="h6">Address</Typography>
						{editMsg ? (
							<div className="row">
								<Select
									value={country}
									onChange={onChangeCountry}
									fullWidth
									variant="outlined"
									margin="normal"
								>
									{currentUser.country ? (
										<MenuItem value={currentUser.country}>{currentUser.country}</MenuItem>
									) : (
										<MenuItem value="N/A">Select Country</MenuItem>
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
									value={city ? city : ''}
									onChange={onChangeCity}
								/>
							</div>
						) : (
							<Typography color="textSecondary">
								{currentUser.city === null ? '--' : currentUser.city},{' '}
								{currentUser.country === null ? '--' : currentUser.country}
							</Typography>
						)}
					</div>
					<div className="mt-3">
						{!editMsg ? (
							<Button variant="contained" color="primary" onClick={editProfile} disabled={loading}>
								{loading && <CircularProgress size={24} />}
								Edit
							</Button>
						) : (
							<Button variant="outlined" color="primary" onClick={cancelEdit} disabled={loading}>
								{loading && <CircularProgress size={24} />}
								Cancel
							</Button>
						)}
						{cancelMsg && <Alert severity="error">Profile update canceled</Alert>}
						{editMsg && (
							<Button variant="contained" color="success" onClick={saveProfile} disabled={loading}>
								{loading && <CircularProgress size={24} />}
								Save
							</Button>
						)}
						{successful && <Alert severity="success">Profile updated successfully</Alert>}
					</div>
				</CardContent>
			</Card>
		</Container>
	);
};

export default Profile;
