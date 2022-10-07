import { EmailValidatorAdapter } from "./email-validator-adapter";
import validator from "validator";

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true;
  }
}));

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter();
}

describe('EmailValidator Adapter', () => {
  it('Should return false if validator returns false', () => {
    const sut = makeSut();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    const isValid = sut.isValid('invalidtest@test.com');
    expect(isValid).toBe(false);
  })

  it('Should return true if validator returns true', () => {
    const sut = makeSut();
    const isValid = sut.isValid('test@test.com');
    expect(isValid).toBe(true);
  })

  it('Should call validator with right email', () => {
    const sut = makeSut();
    const isEmailSpy = jest.spyOn(validator, 'isEmail');
    sut.isValid('test@test.com');
    expect(isEmailSpy).toHaveBeenCalledWith('test@test.com');
  })
})