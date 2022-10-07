import { EmailValidatorAdapter } from "./email-validator";

describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid('invalidtest@test.com');
    expect(isValid).toBe(false);
  })
})