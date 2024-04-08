import { SurveyResultModel } from '../model/survey-result';

export type AddSurveyResultModel = Omit<SurveyResultModel, 'id'>;

export interface SaveSurveyResult {
	save(data: AddSurveyResultModel): Promise<void>;
}
