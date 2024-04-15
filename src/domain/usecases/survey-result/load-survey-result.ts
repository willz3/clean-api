import { SurveyResultModel } from '@/domain/model/survey-result';

export interface LoadSurveyResult {
	load(surveyId: string, accountId: string): Promise<SurveyResultModel>;
}
