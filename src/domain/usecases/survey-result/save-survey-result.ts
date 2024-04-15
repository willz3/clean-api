import { SurveyResultModel } from '@/domain/model/survey-result';

interface SaveSurveyResult {
	save(data: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result>;
}

export namespace SaveSurveyResult {
	export type Params = {
		surveyId: string;
		accountId: string;
		answer: string;
		date: Date;
	};
	export type Result = SurveyResultModel;
}

export { SaveSurveyResult };
