import { InvalidParamError } from "../errors/invalid-param-error";
import { MissingParamError } from "../errors/missing-param-error"
import { EmailValidator } from "../protocols/email-validator";
import { SignUpController } from "./signup"

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
}

const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true;
    }
  }
  const emailValidatorStub = new EmailValidatorStub();
  const sut = new SignUpController(emailValidatorStub);
  return {
    sut,
    emailValidatorStub
  }
}

describe('Signup Controller', () => {
  it('Should return 400 if no name is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {        
        email: 'test@test.com',
        password: 'test12345',
        passwordConfirmation: 'test12345'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  it('Should return 400 if no email is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {        
        name: 'test',
        password: 'test12345',
        passwordConfirmation: 'test12345'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return 400 if no password is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {        
        name: 'test',
        email: 'test@test.com',        
        passwordConfirmation: 'test12345'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should return 400 if no password confirmation is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {        
        name: 'test',
        email: 'test@test.com',
        password: 'test12345',        
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  it('Should return 400 if provided email is invalid', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {        
        name: 'test',
        email: 'invalidtest@test.com',
        password: 'test12345',
        passwordConfirmation: 'test12345'        
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
})