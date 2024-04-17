import { MongoHelper, QueryBuilder } from '@/infra/db/mongodb/helpers';
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository';
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository';
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository';
import { ObjectId } from 'mongodb';
import { CheckSurveyByIdRepository } from '@/data/protocols/db/survey/check-survey-by-id-repository';

export class SurveyMongoRepository
	implements
		AddSurveyRepository,
		LoadSurveysRepository,
		LoadSurveyByIdRepository,
		CheckSurveyByIdRepository
{
	async checkById(
		id: CheckSurveyByIdRepository.Param
	): Promise<CheckSurveyByIdRepository.Result> {
		const surveyCollection = await MongoHelper.getCollection('surveys');
		const survey = await surveyCollection.findOne(
			{ _id: new ObjectId(id) },
			{ projection: { _id: 1 } }
		);
		return survey != null;
	}

	async add(data: AddSurveyRepository.Params): Promise<AddSurveyRepository.Result> {
		const surveyCollection = await MongoHelper.getCollection('surveys');
		await surveyCollection.insertOne(data);
	}

	async loadAll(
		accountId: LoadSurveysRepository.Param
	): Promise<LoadSurveysRepository.Result> {
		const surveyCollection = await MongoHelper.getCollection('surveys');

		const query = new QueryBuilder()
			.lookup({
				from: 'surveyResults',
				foreignField: 'surveyId',
				localField: '_id',
				as: 'result'
			})
			.project({
				_id: 1,
				question: 1,
				answers: 1,
				date: 1,
				didAnswer: {
					$gte: [
						{
							$size: {
								$filter: {
									input: '$result',
									as: 'item',
									cond: {
										$eq: ['$$item.accountId', new ObjectId(accountId)]
									}
								}
							}
						},
						1
					]
				}
			})
			.build();

		const surveys = await surveyCollection.aggregate(query).toArray();
		return MongoHelper.mapCollection(surveys);
	}

	async loadById(
		id: LoadSurveyByIdRepository.Param
	): Promise<LoadSurveyByIdRepository.Result> {
		const surveyCollection = await MongoHelper.getCollection('surveys');
		const survey = await surveyCollection.findOne({ _id: new ObjectId(id) });
		return survey && MongoHelper.map(survey);
	}
}
