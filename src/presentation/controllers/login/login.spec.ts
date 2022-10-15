import { Authentication, AuthenticationData } from "../../../domain/usecases/authentication";
import { MissingParamError, ServerError } from "../../errors";
import { badRequest, ok, unauthorized } from "../../helpers/http-helper";
import { AccountModel } from "../signup/signup-protocols";
import { LoginController } from "./login"

const makeAuthentication = () => {
  class AuthenticationStub implements Authentication {
    async auth(authenticationData: AuthenticationData): Promise<string> {
      return new Promise(resolve => resolve('test_token'));
    }
  }

  return new AuthenticationStub();
}

const makeSut = () => {
  const authenticationStub = makeAuthentication();
  const sut = new LoginController(authenticationStub);

  return {
    sut,
    authenticationStub
  }
}

describe('Login Controller', () => {
  it('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {        
        password: 'test12345'
      }
    }

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  })

  it('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'test@test.com',                
      }
    }

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  })

  it('Should call authentication with right values', async () => {
    const { sut, authenticationStub } = makeSut();
    const httpRequest = {
      body: {
        email: 'test@test.com',
        password: 'test12345'                
      }
    }

    const authenticationStubSpy = jest.spyOn(authenticationStub, 'auth');
    await sut.handle(httpRequest);

    expect(authenticationStubSpy).toHaveBeenCalledWith(httpRequest.body);
  })

  it ('Should return a token and 200 if account exists', async () => {
    const { sut, authenticationStub } = makeSut();
    const httpRequest = {
      body: {
        email: 'test@test.com',
        password: 'test12345'                
      }
    }
    
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(ok('test_token'));
  })

  it('Should return 500 if Authorization throws', async () => {    
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    })
    const httpRequest = {
      body: {        
        email: 'test@test.com',
        password: 'test12345',        
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())

  })

  it('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut();
    const httpRequest = {
      body: {
        email: 'test@test.com',
        password: 'test12345'                
      }
    }

    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve(null)));
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(unauthorized());
  })
})