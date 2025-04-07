import { Alert } from '@mui/material';
import React from 'react';
import { isEmail } from 'validator';

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

/**
 * Validates that a field contains a valid email
 * @param {string} value - The value to validate
 * @returns {JSX.Element|undefined} Alert component if validation fails, undefined otherwise
 */
export const validateEmail = (value) => {
    if (!isEmail(value)) {
        return <Alert severity="error">This is not a valid email.</Alert>;
    }
    return undefined;
};

/**
 * Validates that a username meets length requirements
 * @param {string} value - The value to validate
 * @returns {JSX.Element|undefined} Alert component if validation fails, undefined otherwise
 */
export const validateUsername = (value) => {
    if (value.length < 3 || value.length > 20) {
        return <Alert severity="error">The username must be between 3 and 20 characters.</Alert>;
    }
    return undefined;
};

/**
 * Validates that a password meets length requirements
 * @param {string} value - The value to validate
 * @returns {JSX.Element|undefined} Alert component if validation fails, undefined otherwise
 */
export const validatePassword = (value) => {
    if (value.length < 6 || value.length > 40) {
        return <Alert severity="error">The password must be between 6 and 40 characters.</Alert>;
    }
    return undefined;
};
