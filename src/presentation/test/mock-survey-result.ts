import { SurveyResultModel } from '@/domain/model/survey-result';
import { mockSurveyResultModel } from '@/domain/test';
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result';
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

const mockLoadSurveyResult = (): LoadSurveyResult => {
	class LoadSurveyResultStub implements LoadSurveyResult {
		async load(surveyId: string): Promise<SurveyResultModel> {
			return Promise.resolve(mockSurveyResultModel());
		}
	}
	return new LoadSurveyResultStub();
};

export { mockSaveSurveyResult, mockLoadSurveyResult };
