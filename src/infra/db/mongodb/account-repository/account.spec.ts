import { MongoHelper } from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account';

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository();
}

describe('Account Mongo Repository', () => {  
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  })

  afterAll(async () => {
    await MongoHelper.disconnect();
  })

  it('Should return an Account on success', async () => {
    const sut = makeSut();
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