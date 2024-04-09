import {
	AddAccountRepository,
	LoadAccountByEmailRepository,
	UpdateAccessTokenRepository,
	LoadAccountByToken,
	AccountModel,
	MongoHelper,
	AddAccountParams
} from './account-mongo-repository-protocols';

export class AccountMongoRepository
	implements
		AddAccountRepository,
		LoadAccountByEmailRepository,
		UpdateAccessTokenRepository,
		LoadAccountByToken
{
	async loadByToken(accessToken: string, role?: string): Promise<AccountModel> {
		const accountCollection = await MongoHelper.getCollection('accounts');
		const account = await accountCollection.findOne({
			accessToken,
			$or: [
				{
					role
				},
				{
					role: 'admin'
				}
			]
		});

		return account && MongoHelper.map(account);
	}

	async add(accountData: AddAccountParams): Promise<AccountModel> {
		const accountCollection = await MongoHelper.getCollection('accounts');
		const result = await accountCollection.insertOne(accountData);
		return MongoHelper.map(result.ops[0]);
	}

	async loadByEmail(email: string): Promise<AccountModel | null> {
		const accountCollection = await MongoHelper.getCollection('accounts');
		const account = await accountCollection.findOne({ email });
		return account && MongoHelper.map(account);
	}

	async updateAccessToken(id: string, token: string): Promise<void> {
		const accountCollection = await MongoHelper.getCollection('accounts');
		await accountCollection.updateOne(
			{ _id: id },
			{
				$set: {
					accessToken: token
				}
			}
		);
	}
}
