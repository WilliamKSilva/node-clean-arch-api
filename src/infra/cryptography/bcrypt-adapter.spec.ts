import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise(resolve => resolve('test'));
  } 
}))

const salt = 12;
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
}

describe('Bcrypt Adapter', () => {
  it('Should call bcrypt with right value', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt('test');
    expect(hashSpy).toHaveBeenCalledWith('test', salt);
  })

  it('Should return a hash on success', async () => {
    const sut = makeSut();    
    const hash = await sut.encrypt('test');
    expect(hash).toBe('test');
  })
})