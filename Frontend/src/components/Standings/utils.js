/**
 * Fetches users from the API
 * @param {Object} userService - User service instance
 * @returns {Array} Array of user objects
 */
export const fetchUsers = async (userService) => {
	try {
		const response = await userService.GetAllUsers();
		return response.data || [];
	} catch (error) {
		console.error('Error fetching users:', error);
		return [];
	}
};

/**
 * Fetches countries from the API or local storage
 * @param {Object} countryService - Country service instance
 * @returns {Array} Array of country objects
 */
export const fetchCountries = async (countryService) => {
	try {
		if (localStorage.getItem('countries') === null) {
			const response = await countryService.GetAllCounties();
			const sortedCountries = response.data.sort((a, b) => a.name.common.localeCompare(b.name.common));

			localStorage.setItem('countries', JSON.stringify(sortedCountries));
			return sortedCountries;
		} else {
			return JSON.parse(localStorage.getItem('countries'));
		}
	} catch (error) {
		console.error('Error fetching countries:', error);
		return [];
	}
};

/**
 * Sorts users by a specific key and direction
 * @param {Array} users - Array of user objects
 * @param {string} key - Key to sort by
 * @param {string} direction - Sort direction ('asc' or 'desc')
 * @returns {Array} Sorted array of users
 */
export const sortUsers = (users, key, direction) => {
	if (!users || !Array.isArray(users)) return [];

	return [...users].sort((a, b) => {
		// Handle null values
		const valueA = a[key] === null ? '' : a[key];
		const valueB = b[key] === null ? '' : b[key];

		// Compare based on type
		if (typeof valueA === 'string' && typeof valueB === 'string') {
			return direction === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
		} else {
			return direction === 'asc' ? valueA - valueB : valueB - valueA;
		}
	});
};

/**
 * Filters users by country
 * @param {Array} users - Array of user objects
 * @param {string} country - Country to filter by
 * @returns {Array} Filtered array of users
 */
export const filterUsersByCountry = (users, country) => {
	if (!users || !Array.isArray(users)) return [];
	if (!country) return users;

	return users.filter((user) => user.country === country);
};
