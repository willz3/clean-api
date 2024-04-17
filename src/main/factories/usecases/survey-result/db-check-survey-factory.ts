import { DbCheckSurveyById } from '@/data/usecases/survey/check-survey-by-id/db-check-survey-by-id';
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository';

export const makeDbCheckSurveyById = (): DbCheckSurveyById => {
	const surveyMongoRepository = new SurveyMongoRepository();
	return new DbCheckSurveyById(surveyMongoRepository);
};
