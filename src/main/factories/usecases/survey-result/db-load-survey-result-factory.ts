import { DbLoadSurveyResult } from '@/data/usecases/survey-result/load-survey-result/db-load-survey-result';
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-mongo-repository';
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository';

export const makeDbLoadSurveyResult = (): DbLoadSurveyResult => {
	const surveyResultRepository = new SurveyResultMongoRepository();
	const surveyRepository = new SurveyMongoRepository();
	return new DbLoadSurveyResult(surveyResultRepository, surveyRepository);
};
