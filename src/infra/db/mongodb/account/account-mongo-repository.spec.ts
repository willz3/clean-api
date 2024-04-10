import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account-mongo-repository';
import { mockAddAccountParams } from '@/domain/test';

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

	describe('add()', () => {
		test('Should return an account on add success', async () => {
			const sut = makeSut();
			const account = await sut.add(mockAddAccountParams());

			expect(account).toBeTruthy();
			expect(account.id).toBeTruthy();
			expect(account.name).toBe('any_name');
			expect(account.email).toBe('any_email@mail.com');
			expect(account.password).toBe('any_password');
		});
	});

	describe('loadByEmail()', () => {
		test('Should return an account on loadByEmail success', async () => {
			await accountCollection.insertOne(mockAddAccountParams());

			const sut = makeSut();

			const account = await sut.loadByEmail('any_email@mail.com');

			expect(account).toBeTruthy();

			expect(account?.name).toBe('any_name');
			expect(account?.email).toBe('any_email@mail.com');
			expect(account?.password).toBe('any_password');
		});

		test('Should return null on loadByEmail fails', async () => {
			const sut = makeSut();

			const account = await sut.loadByEmail('any_email@mail.com');

			expect(account).toBeFalsy();
		});
	});

	describe('updateAccessToken()', () => {
		test('Should update the account accessToken on UpdateAccesToken success', async () => {
			const result = await accountCollection.insertOne(mockAddAccountParams());
			const accountResult = result.ops[0];
			expect(accountResult.accessToken).toBeFalsy();

			const sut = makeSut();
			await sut.updateAccessToken(accountResult._id, 'any_token');
			const account = await accountCollection.findOne({ _id: accountResult._id });

			expect(account).toBeTruthy();
			expect(account.accessToken).toBe('any_token');
		});
	});

	describe('loadByToken()', () => {
		test('Should return an account on loadByToken success without role', async () => {
			await accountCollection.insertOne({
				...mockAddAccountParams(),
				accessToken: 'any_token'
			});

			const sut = makeSut();

			const account = await sut.loadByToken('any_token');

			expect(account).toBeTruthy();

			expect(account?.name).toBe('any_name');
			expect(account?.email).toBe('any_email@mail.com');
			expect(account?.password).toBe('any_password');
		});

		test('Should return an account on loadByToken success with admin role', async () => {
			await accountCollection.insertOne({
				...mockAddAccountParams(),
				accessToken: 'any_token',
				role: 'admin'
			});

			const sut = makeSut();

			const account = await sut.loadByToken('any_token', 'admin');

			expect(account).toBeTruthy();

			expect(account?.name).toBe('any_name');
			expect(account?.email).toBe('any_email@mail.com');
			expect(account?.password).toBe('any_password');
		});

		test('Should return null on loadByToken success with invalid role', async () => {
			await accountCollection.insertOne({
				...mockAddAccountParams(),
				accessToken: 'any_token'
			});

			const sut = makeSut();

			const account = await sut.loadByToken('any_token', 'admin');

			expect(account).toBeFalsy();
		});

		test('Should return an account on loadByToken if user is admin', async () => {
			await accountCollection.insertOne({
				...mockAddAccountParams(),
				accessToken: 'any_token',
				role: 'admin'
			});

			const sut = makeSut();

			const account = await sut.loadByToken('any_token');

			expect(account).toBeTruthy();

			expect(account?.name).toBe('any_name');
			expect(account?.email).toBe('any_email@mail.com');
			expect(account?.password).toBe('any_password');
		});

		test('Should return null on loadByToken fails', async () => {
			const sut = makeSut();

			const account = await sut.loadByToken('any_token');

			expect(account).toBeFalsy();
		});
	});
});
