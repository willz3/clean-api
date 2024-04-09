import { DbSaveSurveyResult } from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result';
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-mongo-repository';

export const makeDbSaveSurveyResult = (): DbSaveSurveyResult => {
	return new DbSaveSurveyResult(new SurveyResultMongoRepository());
};
