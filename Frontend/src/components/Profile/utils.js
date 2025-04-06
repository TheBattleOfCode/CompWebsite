/**
 * Encodes an image file as a base64 URL
 * @param {HTMLElement} element - The file input element
 * @param {string} currentProfilePicture - The current profile picture URL
 * @param {Function} setProfilePicture - State setter for profile picture
 * @param {Function} setUploadName - State setter for upload name
 */
export const encodeImageFileAsURL = (element, currentProfilePicture, setProfilePicture, setUploadName) => {
	const file = element.files[0];
	if (!file) return;

	const reader = new FileReader();

	reader.onloadend = function () {
		// Check if image size is too big (100KB limit)
		if (reader.result.length > 100000) {
			alert(
				`Image size is too big\nMax size is 100kb\nYour image size is ${Math.round(
					reader.result.length / 1000,
				)}kb`,
			);
			return;
		}

		// Check if the selected image is the same as the current one
		if (reader.result === currentProfilePicture) {
			setUploadName('You chose your old profile picture');
		} else {
			setUploadName(file.name);
		}

		setProfilePicture(reader.result);
	};

	reader.readAsDataURL(file);
};
