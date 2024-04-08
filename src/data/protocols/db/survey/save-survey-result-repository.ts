import { SurveyResultModel } from '@/domain/model/survey-result';
import { SaveSurveyResultModel } from '@/domain/usecases/save-survey-result';

export interface SaveSurveyResultRepository {
	save(data: SaveSurveyResultModel): Promise<SurveyResultModel>;
}
