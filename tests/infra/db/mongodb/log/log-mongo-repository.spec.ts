import { LogMongoRepository } from '@/infra/db/mongodb/log/log-mongo-repository';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { Collection } from 'mongodb';
import faker from 'faker';

const makeSut = (): LogMongoRepository => {
	return new LogMongoRepository();
};

describe('LogMongoRepository', () => {
	let errorCollection: Collection;

	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL);
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});

	beforeEach(async () => {
		errorCollection = await MongoHelper.getCollection('errors');
		await errorCollection.deleteMany({});
	});

	test('Should create an error log on success', async () => {
		const sut = makeSut();
		await sut.logError(faker.random.words());
		const count = await errorCollection.countDocuments();
		expect(count).toBe(1);
	});
});
