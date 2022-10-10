import { AddAccountRepository } from "../../../../data/protocols/add-account-repository";
import { AccountModel } from "../../../../domain/models/account";
import { AddAccountModel } from "../../../../domain/usecases/add-account";
import { MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts');
    const account: AccountModel = {
      id: '',
      email: accountData.email,
      name: accountData.name,
      password: accountData.password
    };    
    const result = await accountCollection.insertOne(accountData);
    account.id = result.insertedId.toJSON();
     
    return account;
  }
}