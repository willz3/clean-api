import { MongoHelper as sut } from '@/infra/db/mongodb/helpers';

describe('Mongo Helper', () => {
	beforeAll(async () => {
		await sut.connect(process.env.MONGO_URL);
	});

	test('Should reconnect if mongodb is down', async () => {
		let accountCollection = await sut.getCollection('accounts');
		expect(accountCollection).toBeTruthy();
		await sut.disconnect();
		accountCollection = await sut.getCollection('accounts');
		expect(accountCollection).toBeTruthy();
	});

	afterAll(async () => {
		await sut.disconnect();
	});
});
