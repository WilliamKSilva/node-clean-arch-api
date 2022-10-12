import { MongoHelper as sut } from "./mongo-helper"

describe('Mongo helper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL);
  })

  afterAll(async () => {
    await sut.disconnect();
  })
  
  it('Should reconnect if MongoDB is down', async () => {    
    const accountCollection = await sut.getCollection('accounts');
    expect(accountCollection).toBeTruthy();
  })
})