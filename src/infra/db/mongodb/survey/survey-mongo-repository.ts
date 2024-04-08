import { LoadSurveyByIdRepository } from '@/data/usecases/load-survey-by-id/db-load-survey-by-id-protocols';
import {
	AddSurveyRepository,
	LoadSurveysRepository,
	SurveyModel,
	MongoHelper,
	AddSurveyModel
} from './survey-mongo-repository-protocols';

export class SurveyMongoRepository
	implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository
{
	async loadAll(): Promise<SurveyModel[]> {
		const surveyCollection = await MongoHelper.getCollection('surveys');
		return surveyCollection.find().toArray();
	}

	async add(survey: AddSurveyModel): Promise<void> {
		const surveyCollection = await MongoHelper.getCollection('surveys');
		await surveyCollection.insertOne(survey);
	}

	async loadById(id: string): Promise<SurveyModel> {
		const surveyCollection = await MongoHelper.getCollection('surveys');
		const survey = await surveyCollection.findOne({
			_id: id
		});

		return survey;
	}
}
