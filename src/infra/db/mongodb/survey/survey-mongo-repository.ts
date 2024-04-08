import {
	AddSurveyRepository,
	LoadSurveysRepository,
	SurveyModel,
	MongoHelper,
	AddSurveyModel,
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

	async add(survey: AddSurveyModel): Promise<void> {
		const surveyCollection = await MongoHelper.getCollection('surveys');
		await surveyCollection.insertOne(survey);
	}

	async loadById(id: string): Promise<SurveyModel> {
		const surveyCollection = await MongoHelper.getCollection('surveys');
		const survey = await surveyCollection.findOne({
			_id: id
		});

		return survey && MongoHelper.map(survey);
	}
}
