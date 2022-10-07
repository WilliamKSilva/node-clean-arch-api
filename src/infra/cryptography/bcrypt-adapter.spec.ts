import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise(resolve => resolve('test'));
  } 
}))

describe('Bcrypt Adapter', () => {
  it('Should call bcrypt with right value', async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt('test');
    expect(hashSpy).toHaveBeenCalledWith('test', salt);
  })

  it('Should return a hash on success', async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);    
    const hash = await sut.encrypt('test');
    expect(hash).toBe('test');
  })
})