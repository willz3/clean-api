import { ObjectId } from 'mongodb';
import {
	AddSurveyRepository,
	LoadSurveysRepository,
	SurveyModel,
	MongoHelper,
	AddSurveyParams,
	LoadSurveyByIdRepository
} from './survey-mongo-repository-protocols';

export class SurveyMongoRepository
	implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository
{
	async loadAll(): Promise<SurveyModel[]> {
		const surveyCollection = await MongoHelper.getCollection('surveys');
		const surveys = await surveyCollection.find().toArray();
		return MongoHelper.mapCollection(surveys);
	}

	async add(survey: AddSurveyParams): Promise<void> {
		const surveyCollection = await MongoHelper.getCollection('surveys');
		await surveyCollection.insertOne(survey);
	}

	async loadById(id: string): Promise<SurveyModel> {
		const surveyCollection = await MongoHelper.getCollection('surveys');
		const survey = await surveyCollection.findOne({
			_id: new ObjectId(id)
		});

		return survey && MongoHelper.map(survey);
	}
}
