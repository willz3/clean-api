import { SurveyResultModel } from '@/domain/model/survey-result';

export interface LoadSurveyResult {
	load(surveyId: string, accountId: string): Promise<LoadSurveyResult.Result>;
}

export namespace LoadSurveyResult {
	export type Result = SurveyResultModel;
}
