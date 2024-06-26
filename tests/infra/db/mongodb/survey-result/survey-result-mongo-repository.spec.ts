import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-mongo-repository';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { SurveyModel } from '@/domain/model/survey';
import { Collection, ObjectId } from 'mongodb';
import { mockAddSurveyParams, mockAddAccountParams } from '@/tests/domain/mock';

let surveyCollection: Collection;
let surveyResultCollection: Collection;
let accountCollection: Collection;

const makeSut = (): SurveyResultMongoRepository => {
	return new SurveyResultMongoRepository();
};

const mockSurvey = async (): Promise<SurveyModel> => {
	const res = await surveyCollection.insertOne(mockAddSurveyParams());
	return MongoHelper.map(res.ops[0]);
};

const mockAccountId = async (): Promise<string> => {
	const res = await accountCollection.insertOne(mockAddAccountParams());
	return res.ops[0]._id;
};

describe('SurveyMongoRepository', () => {
	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL);
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});

	beforeEach(async () => {
		surveyCollection = await MongoHelper.getCollection('surveys');
		await surveyCollection.deleteMany({});
		surveyResultCollection = await MongoHelper.getCollection('surveyResults');
		await surveyResultCollection.deleteMany({});
		accountCollection = await MongoHelper.getCollection('accounts');
		await accountCollection.deleteMany({});
	});

	describe('save()', () => {
		test('Should add a survey result if its new', async () => {
			const survey = await mockSurvey();
			const accountId = await mockAccountId();
			const sut = makeSut();
			await sut.save({
				surveyId: survey.id,
				accountId,
				answer: survey.answers[0].answer,
				date: new Date()
			});
			const surveyResult = await surveyResultCollection.findOne({
				surveyId: survey.id,
				accountId
			});
			expect(surveyResult).toBeTruthy();
		});

		test('Should update survey result if its not new', async () => {
			const survey = await mockSurvey();
			const accountId = await mockAccountId();
			await surveyResultCollection.insertOne({
				surveyId: new ObjectId(survey.id),
				accountId: new ObjectId(accountId),
				answer: survey.answers[0].answer,
				date: new Date()
			});
			const sut = makeSut();
			await sut.save({
				surveyId: survey.id,
				accountId,
				answer: survey.answers[1].answer,
				date: new Date()
			});
			const surveyResult = await surveyResultCollection
				.find({
					surveyId: survey.id,
					accountId
				})
				.toArray();
			expect(surveyResult).toBeTruthy();
			expect(surveyResult).toHaveLength(1);
		});
	});

	describe('loadBySurveyId()', () => {
		test('Should load survey result', async () => {
			const survey = await mockSurvey();
			const accountId = await mockAccountId();
			const otherAccountId = await mockAccountId();
			await surveyResultCollection.insertMany([
				{
					surveyId: new ObjectId(survey.id),
					accountId: new ObjectId(accountId),
					answer: survey.answers[0].answer,
					date: new Date()
				},
				{
					surveyId: new ObjectId(survey.id),
					accountId: new ObjectId(otherAccountId),
					answer: survey.answers[0].answer,
					date: new Date()
				}
			]);
			const sut = makeSut();
			const surveyResult = await sut.loadBySurveyId(survey.id, accountId);
			expect(surveyResult).toBeTruthy();
			expect(surveyResult.surveyId).toEqual(survey.id);
			expect(surveyResult.answers[0].count).toBe(2);
			expect(surveyResult.answers[0].percent).toBe(100);
			expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(true);
			expect(surveyResult.answers[1].count).toBe(0);
			expect(surveyResult.answers[1].percent).toBe(0);
			expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false);
		});

		test('Should load survey result 2', async () => {
			const survey = await mockSurvey();
			const firstAccountId = await mockAccountId();
			const secondAccountId = await mockAccountId();
			const thirdAccountId = await mockAccountId();
			await surveyResultCollection.insertMany([
				{
					surveyId: new ObjectId(survey.id),
					accountId: new ObjectId(firstAccountId),
					answer: survey.answers[0].answer,
					date: new Date()
				},
				{
					surveyId: new ObjectId(survey.id),
					accountId: new ObjectId(secondAccountId),
					answer: survey.answers[1].answer,
					date: new Date()
				},
				{
					surveyId: new ObjectId(survey.id),
					accountId: new ObjectId(thirdAccountId),
					answer: survey.answers[1].answer,
					date: new Date()
				}
			]);
			const sut = makeSut();
			const surveyResult = await sut.loadBySurveyId(survey.id, secondAccountId);
			expect(surveyResult).toBeTruthy();
			expect(surveyResult.surveyId).toEqual(survey.id);
			expect(surveyResult.answers[0].count).toBe(2);
			expect(surveyResult.answers[0].percent).toBe(67);
			expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(true);
			expect(surveyResult.answers[1].count).toBe(1);
			expect(surveyResult.answers[1].percent).toBe(33);
			expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false);
		});

		test('Should load survey result 3', async () => {
			const survey = await mockSurvey();
			const firstAccountId = await mockAccountId();
			const secondAccountId = await mockAccountId();
			const thirdAccountId = await mockAccountId();
			await surveyResultCollection.insertMany([
				{
					surveyId: new ObjectId(survey.id),
					accountId: new ObjectId(firstAccountId),
					answer: survey.answers[0].answer,
					date: new Date()
				},
				{
					surveyId: new ObjectId(survey.id),
					accountId: new ObjectId(secondAccountId),
					answer: survey.answers[1].answer,
					date: new Date()
				}
			]);
			const sut = makeSut();
			const surveyResult = await sut.loadBySurveyId(survey.id, thirdAccountId);
			expect(surveyResult).toBeTruthy();
			expect(surveyResult.surveyId).toEqual(survey.id);
			expect(surveyResult.answers[0].count).toBe(1);
			expect(surveyResult.answers[0].percent).toBe(50);
			expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(false);
			expect(surveyResult.answers[1].count).toBe(1);
			expect(surveyResult.answers[1].percent).toBe(50);
			expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false);
		});

		test('Should return null if there is no survey result', async () => {
			const survey = await mockSurvey();
			const accountId = await mockAccountId();
			const sut = makeSut();
			const surveyResult = await sut.loadBySurveyId(survey.id, accountId);
			expect(surveyResult).toBeNull();
		});
	});
});
