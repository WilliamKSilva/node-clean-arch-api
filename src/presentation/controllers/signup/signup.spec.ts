import { InvalidParamError, MissingParamError, ServerError } from '../../errors';
import { EmailValidator, AccountModel, AddAccount, AddAccountModel } from "./signup-protocols";
import { SignUpController } from "./signup"

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const accountFake = {
        id: 'test_id',
        name: 'test',
        email: 'test@test.com',
        password: 'test12345'
      }

      return new Promise(resolve => resolve(accountFake));
    }
  }
  return new AddAccountStub();
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();
  const sut = new SignUpController(emailValidatorStub, addAccountStub);
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('Signup Controller', () => {
  it('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {        
        email: 'test@test.com',
        password: 'test12345',
        passwordConfirmation: 'test12345'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  it('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {        
        name: 'test',
        password: 'test12345',
        passwordConfirmation: 'test12345'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {        
        name: 'test',
        email: 'test@test.com',        
        passwordConfirmation: 'test12345'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should return 400 if no password confirmation is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {        
        name: 'test',
        email: 'test@test.com',
        password: 'test12345',        
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  it('Should return 400 if password confirmation fails', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {        
        name: 'test',
        email: 'test@test.com',
        password: 'test12345',
        passwordConfirmation: 'test'        
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  it('Should return 400 if provided email is invalid', async () => {
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
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  it('Should call EmailValidator with right email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {        
        name: 'test',
        email: 'test@test.com',
        password: 'test12345',
        passwordConfirmation: 'test12345'        
      }
    }    
    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith('test@test.com');
  })

  it('Should return 500 if EmailValidator throws', async () => {    
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    })
    const httpRequest = {
      body: {        
        name: 'test',
        email: 'test@test.com',
        password: 'test12345',
        passwordConfirmation: 'test12345'        
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should call AddAccount with correct values', async () => {    
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add');
    const httpRequest = {
      body: {        
        name: 'test',
        email: 'test@test.com',
        password: 'test12345',
        passwordConfirmation: 'test12345'        
      }
    }
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'test',
      email: 'test@test.com',
      password: 'test12345',
    })
  })

  it('Should return 500 if AddAccount throws', async () => {    
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    })
    const httpRequest = {
      body: {        
        name: 'test',
        email: 'test@test.com',
        password: 'test12345',
        passwordConfirmation: 'test12345'        
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {        
        name: 'test',
        email: 'test@test.com',
        password: 'test12345',
        passwordConfirmation: 'test12345'        
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'test_id',
      name: 'test',
      email: 'test@test.com',
      password: 'test12345',
    })
  })
})