import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import MockDate from 'mockdate';
import { SurveyModel } from '../survey/survey-mongo-repository-protocols';
import { AccountModel } from '../account/account-mongo-repository-protocols';
import { SurveyResultMongoRepository } from './survey-result-mongo-repository';

let surveyCollection: Collection;
let surveyResultCollection: Collection;
let accountCollection: Collection;

const makeSut = (): SurveyResultMongoRepository => {
	return new SurveyResultMongoRepository();
};

describe('Survey Mongo Repository', () => {
	beforeAll(async () => {
		MockDate.set(new Date());
		await MongoHelper.connect(process.env.MONGO_URL);
	});

	afterAll(async () => {
		MockDate.reset();
		await MongoHelper.disconnect();
	});

	beforeEach(async () => {
		surveyCollection = await MongoHelper.getCollection('surveys');
		await surveyCollection.deleteMany({});
		surveyResultCollection = await MongoHelper.getCollection('surveysResults');
		await surveyResultCollection.deleteMany({});
		accountCollection = await MongoHelper.getCollection('accounts');
		await accountCollection.deleteMany({});
	});

	describe('save()', () => {
		test('Should add a survey on success', async () => {
			const survey = await makeSurvey();
			const account = await makeAccount();
			const sut = makeSut();
			const surveyResult = await sut.save({
				surveyId: survey.id,
				accountId: account.id,
				answer: survey.answers[0].answer,
				date: new Date()
			});

			expect(surveyResult).toBeTruthy();
			expect(surveyResult.id).toBeTruthy();
			expect(surveyResult.answer).toEqual(survey.answers[0].answer);
		});
	});

	const makeSurvey = async (): Promise<SurveyModel> => {
		const res = await surveyCollection.insertOne({
			question: 'any_question',
			answers: [
				{
					image: 'any_image',
					answer: 'any_answer'
				},
				{
					answer: 'other_answer'
				}
			],
			date: new Date()
		});

		return res.ops[0];
	};

	const makeAccount = async (): Promise<AccountModel> => {
		const res = await accountCollection.insertOne({
			name: 'any_name',
			email: 'any_email@mail.com',
			password: 'any_password'
		});

		return res.ops[0];
	};
});
