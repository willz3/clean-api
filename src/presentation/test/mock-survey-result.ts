import { SurveyResultModel } from '@/domain/model/survey-result';
import { mockSurveyResultModel } from '@/domain/test';
import {
	SaveSurveyResult,
	SaveSurveyResultParams
} from '@/domain/usecases/survey-result/save-survey-result';

const mockSaveSurveyResult = (): SaveSurveyResult => {
	class SaveSurveyResultStub implements SaveSurveyResult {
		async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
			return mockSurveyResultModel();
		}
	}

	return new SaveSurveyResultStub();
};

export { mockSaveSurveyResult };
