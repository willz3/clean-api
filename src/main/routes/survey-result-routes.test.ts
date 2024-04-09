import request from 'supertest';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import app from '@/main/config/app';

describe('Survey routes', () => {
	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL as string);
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});

	describe('PUT /surveys/:surveyId/results', () => {
		test('Should return 403 on save survey result without accessToken', async () => {
			const httpResponse = await request(app).put('/api/surveys/any_id/results').send({
				answer: 'any_answer'
			});

			expect(httpResponse.statusCode).toBe(403);
		});
	});
});
