import { filterProblemsByType } from '../../../components/Home/utils';

describe('Home Utils', () => {
    describe('filterProblemsByType', () => {
        const mockProblems = [
            { _id: '1', title: 'Problem 1', type: 'gen' },
            { _id: '2', title: 'Problem 2', type: 'NumberGen' },
            { _id: '3', title: 'Problem 3', type: 'Qna' },
            { _id: '4', title: 'Problem 4', type: 'gen' },
        ];

        it('returns all problems when type is "all"', () => {
            // Arrange & Act
            const result = filterProblemsByType(mockProblems, 'all');

            // Assert
            expect(result).toEqual(mockProblems);
            expect(result.length).toBe(4);
        });

        it('filters problems by type correctly', () => {
            // Arrange & Act
            const genProblems = filterProblemsByType(mockProblems, 'gen');
            const numberGenProblems = filterProblemsByType(mockProblems, 'NumberGen');
            const qnaProblems = filterProblemsByType(mockProblems, 'Qna');

            // Assert
            expect(genProblems.length).toBe(2);
            expect(genProblems[0]._id).toBe('1');
            expect(genProblems[1]._id).toBe('4');

            expect(numberGenProblems.length).toBe(1);
            expect(numberGenProblems[0]._id).toBe('2');

            expect(qnaProblems.length).toBe(1);
            expect(qnaProblems[0]._id).toBe('3');
        });

        it('returns empty array when no problems match the type', () => {
            // Arrange & Act
            const result = filterProblemsByType(mockProblems, 'nonexistent');

            // Assert
            expect(result).toEqual([]);
            expect(result.length).toBe(0);
        });

        it('handles null or undefined problems array', () => {
            // Arrange & Act
            const resultNull = filterProblemsByType(null, 'gen');
            const resultUndefined = filterProblemsByType(undefined, 'gen');

            // Assert
            expect(resultNull).toEqual([]);
            expect(resultUndefined).toEqual([]);
        });

        it('handles non-array problems parameter', () => {
            // Arrange & Act
            const result = filterProblemsByType({}, 'gen');

            // Assert
            expect(result).toEqual([]);
        });
    });
});
