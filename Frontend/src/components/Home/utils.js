/**
 * Filter problems by type
 * @param {Array} problems - Array of problem objects
 * @param {string} type - Problem type to filter by
 * @returns {Array} Filtered array of problems
 */
export const filterProblemsByType = (problems, type) => {
	if (!problems || !Array.isArray(problems)) {
		return [];
	}

	if (type === 'all') {
		return problems;
	}

	return problems.filter((problem) => problem.type === type);
};
