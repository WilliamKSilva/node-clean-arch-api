import { MongoHelper } from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account';

describe('Account Mongo Repository', () => {  
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  })

  afterAll(async () => {
    await MongoHelper.disconnect();
  })

  it('Should return an Account on success', async () => {
    const sut = new AccountMongoRepository();
    const account = await sut.add({
      name: 'test',
      email: 'test@test.com',
      password: 'test12345'
    })

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('test');
    expect(account.email).toBe('test@test.com');
    expect(account.password).toBe('test12345');
  })  
})