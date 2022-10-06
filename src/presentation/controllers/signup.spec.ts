import { MissingParamError } from "../errors/missing-params-error"
import { SignUpController } from "./signup"

describe('Signup Controller', () => {
  it('Should return 400 if no name is provided', () => {
    const sut = new SignUpController()
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
    const sut = new SignUpController()
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
    const sut = new SignUpController()
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
    const sut = new SignUpController()
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
})