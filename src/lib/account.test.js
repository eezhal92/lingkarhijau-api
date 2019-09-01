import * as account from './account';

/**
 * Mock current date as 2019-09-01
 */
const FIRST_SEPTEMBER_TWO_THOUSAND_NINETEEN_MS = 1567304226354;

jest.spyOn(Date, 'now').mockImplementation(() => FIRST_SEPTEMBER_TWO_THOUSAND_NINETEEN_MS);

afterAll(() => {
  Date.now.mockRestore();
});

describe('account lib test', () => {
  describe('createRegistrationNumber', () => {
    it('should create new number when no pass', () => {
      expect(account.createRegistrationNumber(null)).toBe('190900001');
      expect(account.createRegistrationNumber('190900001')).toBe('190900002');
      expect(account.createRegistrationNumber('190900002')).toBe('190900003');
    });
  });
});

