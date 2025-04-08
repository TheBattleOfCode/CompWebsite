import { describe, it, expect } from 'vitest';

import { validateRequired } from '../../components/Login/utils.jsx';

describe('Utils Functions', () => {
  describe('validateRequired', () => {
    it('returns an error message when value is empty', () => {
      const result = validateRequired('');
      expect(result).toBeDefined();
    });

    it('returns undefined when value is provided', () => {
      const result = validateRequired('test');
      expect(result).toBeUndefined();
    });
  });
});
