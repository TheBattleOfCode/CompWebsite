/**
 * Handles file upload change event
 * @param {Event} e - The file input change event
 * @param {Function} setFileContent - State setter for file content
 * @param {Function} setFileName - State setter for file name
 */
export const handleFileChange = (e, setFileContent, setFileName) => {
	const file = e.target.files[0];
	if (!file) {
		return;
	}

	const reader = new FileReader();
	reader.onload = (event) => {
		setFileContent(event.target.result);
		setFileName(file.name);
	};
	reader.readAsText(file);
};

/**
 * Handles form submission for creating a problem
 * @param {Object} params - Parameters for problem creation
 */
export const handleSubmit = ({
	problemType,
	title,
	description,
	score,
	// file parameter is not used but kept for API compatibility
	qnaAnswer,
	min,
	max,
	answer,
	fileContent,
	setSuccessful,
	setMessage,
	setLoading,
	probService,
}) => {
	// Validate inputs based on problem type
	if (problemType === 'N/A') {
		setMessage('Please select a problem type');
		setLoading(false);
		return;
	}

	if (!title || !description) {
		setMessage('Title and description are required');
		setLoading(false);
		return;
	}

	// Create problem data based on type
	let problemData = {
		title,
		description,
		score,
		type: problemType,
	};

	// Add type-specific data
	if (problemType === 'NumberGen') {
		if (min >= max) {
			setMessage('Min must be less than Max');
			setLoading(false);
			return;
		}

		if (answer < min || answer > max) {
			setMessage('Answer must be between Min and Max');
			setLoading(false);
			return;
		}

		problemData = {
			...problemData,
			min,
			max,
			answer,
		};
	} else if (problemType === 'Qna') {
		if (!qnaAnswer) {
			setMessage('Answer is required for Q&A problems');
			setLoading(false);
			return;
		}

		problemData = {
			...problemData,
			answer: qnaAnswer,
		};
	} else if (problemType === 'gen') {
		if (!fileContent) {
			setMessage('File is required for General problems');
			setLoading(false);
			return;
		}

		problemData = {
			...problemData,
			file: fileContent,
		};
	}

	// Submit problem to API
	probService
		.CreateProb(problemData)
		.then(() => {
			setSuccessful(true);
			setMessage('Problem created successfully!');
		})
		.catch((error) => {
			const resMessage =
				(error.response && error.response.data && error.response.data.message) ||
				error.message ||
				error.toString();
			setMessage(resMessage);
		})
		.finally(() => {
			setLoading(false);
		});
};

/**
 * Renders markdown content
 * @param {string} content - Markdown content to render
 * @param {Object} md - Remarkable markdown parser instance
 * @returns {string} HTML content
 */
export const renderMarkdown = (content, md) => {
	if (!content) {
		return '';
	}
	return md.render(content);
};
