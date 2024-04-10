import {
	SaveSurveyResultRepository,
	SaveSurveyResultParams,
	SurveyResultModel,
	MongoHelper
} from './survey-result-mongo-repository-protocols';

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
	async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
		const surveyResultCollection = await MongoHelper.getCollection('surveyResults');
		const res = await surveyResultCollection.findOneAndUpdate(
			{
				surveyId: data.surveyId,
				accountId: data.accountId
			},
			{
				$set: {
					answer: data.answer,
					date: data.date
				}
			},
			{
				upsert: true,
				returnOriginal: false
			}
		);

		return res.value && MongoHelper.map(res.value);
	}
}
