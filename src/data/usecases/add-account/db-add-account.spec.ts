import { DbAddAccount } from "./db-add-account";

describe('DbAddAccount Usecase', () => {
  it('Should call Encrypter with right password', async () => {
    class EncrypterStub {
      async encrypt (value: string): Promise<string> {
        return new Promise(resolve => resolve('hashed_password'));
      }
    }
    const encrypterStub = new EncrypterStub();
    const sut = new DbAddAccount(encrypterStub);
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    const accountData = {
      name: 'test',
      email: 'test@test.com',
      password: 'test12345'
    };
    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith('test12345');
  })
})