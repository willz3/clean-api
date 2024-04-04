import {
	AddSurveyRepository,
	LoadSurveysRepository,
	SurveyModel,
	MongoHelper,
	AddSurveyModel
} from './survey-mongo-repository-protocols';

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
