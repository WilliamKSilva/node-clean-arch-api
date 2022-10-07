import { EmailValidatorAdapter } from "./email-validator";
import validator from "validator";

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true;
  }
}));

describe('EmailValidator Adapter', () => {
  it('Should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    const isValid = sut.isValid('invalidtest@test.com');
    expect(isValid).toBe(false);
  })

  it('Should return true if validator returns true', () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid('test@test.com');
    expect(isValid).toBe(true);
  })

  it('Should call validator with right email', () => {
    const sut = new EmailValidatorAdapter();
    const isEmailSpy = jest.spyOn(validator, 'isEmail');
    sut.isValid('test@test.com');
    expect(isEmailSpy).toHaveBeenCalledWith('test@test.com');
  })
})