import request from 'supertest';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import app from '@/main/config/app';
import { Collection } from 'mongodb';
import { sign } from 'jsonwebtoken';
import env from '@/main/config/env';

let surveyCollection: Collection;
let accountCollection: Collection;
describe('Survey routes', () => {
	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL as string);
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});

	beforeEach(async () => {
		surveyCollection = await MongoHelper.getCollection('surveys');
		accountCollection = await MongoHelper.getCollection('accounts');
		await Promise.all([
			surveyCollection.deleteMany({}),
			accountCollection.deleteMany({})
		]);
	});

	describe('PUT /surveys/:surveyId/results', () => {
		test('Should return 403 on save survey result without accessToken', async () => {
			const httpResponse = await request(app).put('/api/surveys/any_id/results').send({
				answer: 'any_answer'
			});

			expect(httpResponse.statusCode).toBe(403);
		});

		test('Should return 200 on success', async () => {
			const accessToken = await makeAccessToken();

			const res = await surveyCollection.insertOne({
				question: 'Question',
				answers: [
					{
						image: 'http://image-name.com',
						answer: 'Answer 1'
					},
					{
						answer: 'Answer 2'
					}
				],
				date: new Date()
			});

			const httpResponse = await request(app)
				.put(`/api/surveys/${res.ops[0]._id}/results`)
				.set('x-access-token', accessToken)
				.send({
					answer: 'Answer 1'
				});

			expect(httpResponse.statusCode).toBe(200);
		});
	});

	describe('GET /surveys/:surveyId/results', () => {
		test('Should return 403 on load survey result without accessToken', async () => {
			const httpResponse = await request(app).get('/api/surveys/any_id/results');

			expect(httpResponse.statusCode).toBe(403);
		});
	});

	const makeAccessToken = async (): Promise<string> => {
		const res = await accountCollection.insertOne({
			name: 'valid_name',
			email: 'valid_mail@mail.com',
			password: '123'
		});

		const id = res.ops[0]._id;
		const accessToken = sign({ id }, env.jwtSecret);
		await accountCollection.updateOne(
			{
				_id: id
			},
			{
				$set: {
					accessToken
				}
			}
		);

		return accessToken;
	};
});
