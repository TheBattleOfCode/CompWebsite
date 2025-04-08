import { Alert } from '@mui/material';

/**
 * Validates that a field is not empty
 * @param {string} value - The value to validate
 * @returns {JSX.Element|undefined} Alert component if validation fails, undefined otherwise
 */
export const validateRequired = (value) => {
	if (!value) {
		return <Alert severity="error">This field is required!</Alert>;
	}
	return undefined;
};
