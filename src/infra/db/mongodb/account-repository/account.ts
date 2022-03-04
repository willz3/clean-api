import { AddAccountRepository } from "../../../../data/protocols/add-account-repository";
import { AccountModel } from "../../../../domain/model/account";
import { AddAccountModel } from "../../../../domain/usecases/add-account";
import { MongoHelper } from "../helpers/mongo-helper";

export class AccountMongoRepository implements AddAccountRepository {
	async add(account: AddAccountModel): Promise<AccountModel> {
		const accountCollection = MongoHelper.getCollection("accounts");
		const result = await accountCollection.insertOne(account);
		const accountData = result.ops[0];
		const { _id, ...accountWithoutId } = accountData;
		return Object.assign({}, accountWithoutId, { id: _id });
	}
}
