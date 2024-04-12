import { SurveyResultModel } from '@/domain/model/survey-result';

export interface LoadSurveyResult {
	load(surveyId: string): Promise<SurveyResultModel>;
}
