/**
 * Safely evaluates code to generate input/output data
 * @param {string} code - The code to evaluate
 * @returns {Object|null} Generated data or null if error
 */
export const generateInOut = (code) => {
    try {
        // Create a safe evaluation environment
        const sandbox = {};
        const safeEval = new Function('sandbox', `with(sandbox) { ${code} }`);
        safeEval(sandbox);

        return sandbox.result || null;
    } catch (error) {
        console.error('Error generating input/output:', error);
        return null;
    }
};

/**
 * Handles answer submission
 * @param {Object} params - Parameters for answer submission
 * @returns {Object} Result with success status and message
 */
export const handleAnswerSubmit = async ({
    problem,
    answer,
    currentUser,
    userProblemData,
    genProblemService,
    userService,
}) => {
    // Validate inputs
    if (!answer) {
        return {
            success: false,
            message: 'Please enter an answer',
        };
    }

    if (!problem || !currentUser) {
        return {
            success: false,
            message: 'Missing problem or user data',
        };
    }

    // Check if already answered
    if (userProblemData?.answered) {
        return {
            success: false,
            message: 'You have already solved this problem',
        };
    }

    try {
        // Prepare submission data
        const submissionData = {
            userId: currentUser.id,
            probId: problem._id,
            answer: answer.trim(),
        };

        // Submit answer
        const response = await genProblemService.SubmitGenProb(submissionData);

        // Check if answer is correct
        const isCorrect = response.data.correct;

        if (isCorrect) {
            // Update user score if answer is correct
            await userService.UpdateScore(currentUser.id, problem.score);

            return {
                success: true,
                message: 'Correct answer! Your score has been updated.',
            };
        } else {
            return {
                success: false,
                message: 'Incorrect answer. Please try again.',
            };
        }
    } catch (error) {
        console.error('Error in handleAnswerSubmit:', error);

        return {
            success: false,
            message: 'Error submitting answer: ' + (error.message || 'Unknown error'),
        };
    }
};
