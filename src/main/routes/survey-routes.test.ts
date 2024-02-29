import request from 'supertest';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';
import app from '../config/app';
import { Collection } from 'mongodb';

let surveyCollection: Collection;
describe('Survey routes', () => {
	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL as string);
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});

	beforeEach(async () => {
		surveyCollection = await MongoHelper.getCollection('surveys');
		await surveyCollection.deleteMany({});
	});

	describe('POST /surveys', () => {
		test('Should return 204 on add survey success', async () => {
			const httpResponse = await request(app)
				.post('/api/surveys')
				.send({
					question: 'Question',
					answers: [
						{
							answer: 'Answer 1',
							image: 'http://image-name.com'
						},
						{
							answer: 'Answer 2'
						}
					]
				});

			expect(httpResponse.statusCode).toBe(204);
		});
	});
});
