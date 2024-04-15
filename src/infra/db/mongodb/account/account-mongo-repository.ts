import {
	AddAccountRepository,
	LoadAccountByEmailRepository,
	UpdateAccessTokenRepository,
	LoadAccountByTokenRepository,
	MongoHelper
} from './account-mongo-repository-protocols';

export class AccountMongoRepository
	implements
		AddAccountRepository,
		LoadAccountByEmailRepository,
		UpdateAccessTokenRepository,
		LoadAccountByTokenRepository
{
	async add(data: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
		const accountCollection = await MongoHelper.getCollection('accounts');
		const result = await accountCollection.insertOne(data);
		return MongoHelper.map(result.ops[0]);
	}

	async loadByEmail(
		email: LoadAccountByEmailRepository.Param
	): Promise<LoadAccountByEmailRepository.Result> {
		const accountCollection = await MongoHelper.getCollection('accounts');
		const account = await accountCollection.findOne({ email });
		return account && MongoHelper.map(account);
	}

	async updateAccessToken(
		id: string,
		token: string
	): Promise<UpdateAccessTokenRepository.Result> {
		const accountCollection = await MongoHelper.getCollection('accounts');
		await accountCollection.updateOne(
			{
				_id: id
			},
			{
				$set: {
					accessToken: token
				}
			}
		);
	}

	async loadByToken(
		token: string,
		role?: string
	): Promise<LoadAccountByTokenRepository.Result> {
		const accountCollection = await MongoHelper.getCollection('accounts');
		const account = await accountCollection.findOne({
			accessToken: token,
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
}
