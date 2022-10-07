import { Encrypter, AddAccountModel, AccountModel, AddAccountRepository } from "./db-add-account-protocols";
import { DbAddAccount } from "./db-add-account";

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'));
    }
  }
  return new EncrypterStub();
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      const accountFake = {
        id: 'id',
        name: 'test',
        email: 'test@test.com',
        password: 'hashed_password'
      }
      return new Promise(resolve => resolve(accountFake));
    }
  }
  return new AddAccountRepositoryStub();
}

const makeSut = (): SutTypes => {  
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  it('Should call Encrypter with right password', async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    const accountData = {
      name: 'test',
      email: 'test@test.com',
      password: 'test12345'
    };
    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith('test12345');
  })

  it('Should throw an error if Encrypter throws an error', async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))    
    const accountData = {
      name: 'test',
      email: 'test@test.com',
      password: 'test12345'
    };
    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  })

  it('Should call AddAccountRepository with right values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');    
    const accountData = {
      name: 'test',
      email: 'test@test.com',
      password: 'test12345'
    };
    await sut.add(accountData);
    expect(addSpy).toHaveBeenCalledWith({
      name: 'test',
      email: 'test@test.com',
      password: 'hashed_password'
    })
  })
  it('Should throw an error if AddAccountRepository throws an error', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));    
    const accountData = {
      name: 'test',
      email: 'test@test.com',
      password: 'test12345'
    };
    const promise = sut.add(accountData);
    expect(promise).rejects.toThrow();
  })

  it('Should return an account on success', async () => {
    const { sut } = makeSut();    
    const accountData = {
      name: 'test',
      email: 'test@test.com',
      password: 'test12345'
    };
    const account = await sut.add(accountData);
    expect(account).toEqual({
      id: 'id',
      name: 'test',
      email: 'test@test.com',
      password: 'hashed_password'
    })
  })
})