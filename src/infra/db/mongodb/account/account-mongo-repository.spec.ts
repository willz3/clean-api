import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account-mongo-repository';

let accountCollection: Collection;
describe('Account Mongo Repository', () => {
	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL);
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});

	beforeEach(async () => {
		accountCollection = await MongoHelper.getCollection('accounts');
		await accountCollection.deleteMany({});
	});

	const makeSut = (): AccountMongoRepository => {
		return new AccountMongoRepository();
	};

	test('Should return an account on add success', async () => {
		const sut = makeSut();
		const account = await sut.add({
			name: 'any_name',
			email: 'any_email@mail.com',
			password: 'any_password'
		});

		expect(account).toBeTruthy();
		expect(account.id).toBeTruthy();
		expect(account.name).toBe('any_name');
		expect(account.email).toBe('any_email@mail.com');
		expect(account.password).toBe('any_password');
	});

	test('Should return an account on loadByEmail success', async () => {
		await accountCollection.insertOne({
			name: 'any_name',
			email: 'any_email@mail.com',
			password: 'any_password'
		});

		const sut = makeSut();

		const account = await sut.loadByEmail('any_email@mail.com');

		expect(account).toBeTruthy();

		expect(account.name).toBe('any_name');
		expect(account.email).toBe('any_email@mail.com');
		expect(account.password).toBe('any_password');
	});

	test('Should return null on loadByEmail fails', async () => {
		const sut = makeSut();

		const account = await sut.loadByEmail('any_email@mail.com');

		expect(account).toBeFalsy();
	});

	test('Should update the account accessToken on UpdateAccesToken success', async () => {
		const result = await accountCollection.insertOne({
			name: 'any_name',
			email: 'any_email@mail.com',
			password: 'any_password'
		});
		const accountResult = result.ops[0];
		expect(accountResult.accessToken).toBeFalsy();

		const sut = makeSut();
		await sut.updateAccessToken(accountResult._id, 'any_token');
		const account = await accountCollection.findOne({ _id: accountResult._id });

		expect(account).toBeTruthy();
		expect(account.accessToken).toBe('any_token');
	});
});
