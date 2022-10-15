import { MissingParamError } from "../../errors";
import { badRequest } from "../../helpers/http-helper";
import { LoginController } from "./login"

const makeSut = () => {
  const loginControllerStub = new LoginController();

  return {
    loginControllerStub
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
})