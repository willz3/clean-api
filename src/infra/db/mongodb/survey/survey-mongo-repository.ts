import { LoadSurveysRepository } from '../../../../data/protocols/db/survey/load-surveys-repository';
import {
	AddSurveyModel,
	AddSurveyRepository
} from '../../../../data/usecases/add-survey/db-add-survey-protocols';
import { SurveyModel } from '../../../../domain/model/survey';
import { MongoHelper } from '../helpers/mongo-helper';

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
	async loadAll(): Promise<SurveyModel[]> {
		const surveyCollection = await MongoHelper.getCollection('surveys');
		return surveyCollection.find().toArray();
	}

	async add(survey: AddSurveyModel): Promise<void> {
		const surveyCollection = await MongoHelper.getCollection('surveys');
		await surveyCollection.insertOne(survey);
	}
}
