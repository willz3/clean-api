import request from 'supertest';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';
import app from '../config/app';
import { Collection } from 'mongodb';
import { sign } from 'jsonwebtoken';
import env from '../config/env';

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

	describe('POST /surveys', () => {
		test('Should return 403 on add survey without accessToken', async () => {
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

			expect(httpResponse.statusCode).toBe(403);
		});

		test('Should return 204 on add survey success with valid token', async () => {
			const res = await accountCollection.insertOne({
				name: 'valid_name',
				email: 'valid_mail@mail.com',
				password: '123',
				role: 'admin'
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

			const httpResponse = await request(app)
				.post('/api/surveys')
				.set('x-access-token', accessToken)
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
