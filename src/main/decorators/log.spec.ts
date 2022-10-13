import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols";
import { LogControllerDecorator } from "./log"

interface SutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
}

const makeSut = (): SutTypes => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          email: 'test@test.com',
          name: 'test',
          password: 'test12345',
          passwordConfirmation: 'test12345'
        }
      }
      return new Promise(resolve => resolve(httpResponse));
    }
  }

  const controllerStub = new ControllerStub();
  const sut = new LogControllerDecorator(controllerStub);

  return {
    sut,
    controllerStub
  }
}

describe('LogController Decorator', () => {
  it('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut();    
 
    const handleSpy = jest.spyOn(controllerStub, 'handle'); 
    const httpRequest = {
      body: {
        email: 'test@test.com',
        name: 'test',
        password: 'test12345',
        passwordConfirmation: 'test12345'
      }
    }
    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  })
})