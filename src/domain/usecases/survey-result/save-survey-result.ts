import { SurveyResultModel } from '@/domain/model/survey-result';

type SaveSurveyResultParams = Omit<SurveyResultModel, 'id'>;

interface SaveSurveyResult {
	save(data: SaveSurveyResultParams): Promise<SurveyResultModel>;
}

export { SaveSurveyResultParams, SaveSurveyResult };
