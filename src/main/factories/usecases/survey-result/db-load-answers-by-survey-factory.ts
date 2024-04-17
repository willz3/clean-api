import { DbLoadAnswersBySurvey } from '@/data/usecases/survey/load-survey-by-id/db-load-answers-by-survey';
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository';

export const makeDbLoadAnswersBySurvey = (): DbLoadAnswersBySurvey => {
	return new DbLoadAnswersBySurvey(new SurveyMongoRepository());
};
