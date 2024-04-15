import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result';

export interface SaveSurveyResultRepository {
	save(
		data: SaveSurveyResultRepository.Params
	): Promise<SaveSurveyResultRepository.Result>;
}

export namespace SaveSurveyResultRepository {
	export type Params = SaveSurveyResult.Params;
	export type Result = void;
}
