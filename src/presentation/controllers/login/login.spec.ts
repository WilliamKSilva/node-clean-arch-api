import { Authentication, AuthenticationData } from "../../../domain/usecases/authentication";
import { MissingParamError } from "../../errors";
import { badRequest } from "../../helpers/http-helper";
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
  const loginControllerStub = new LoginController(authenticationStub);

  return {
    loginControllerStub,
    authenticationStub
  }
}

describe('Login Controller', () => {
  it('Should return 400 if no email is provided', async () => {
    const { loginControllerStub } = makeSut();
    const httpRequest = {
      body: {        
        password: 'test12345'
      }
    }

    const httpResponse = await loginControllerStub.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  })

  it('Should return 400 if no password is provided', async () => {
    const { loginControllerStub } = makeSut();
    const httpRequest = {
      body: {
        email: 'test@test.com',                
      }
    }

    const httpResponse = await loginControllerStub.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  })

  it('Should call authentication with right values', async () => {
    const { loginControllerStub, authenticationStub } = makeSut();
    const httpRequest = {
      body: {
        email: 'test@test.com',
        password: 'test12345'                
      }
    }

    const authenticationStubSpy = jest.spyOn(authenticationStub, 'auth');
    await loginControllerStub.handle(httpRequest);

    expect(authenticationStubSpy).toHaveBeenCalledWith(httpRequest.body);
  })
})