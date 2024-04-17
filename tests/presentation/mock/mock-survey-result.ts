import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result';
import { mockSurveyResultModel } from '@/tests/domain/mock';
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result';

export class SaveSurveyResultSpy implements SaveSurveyResult {
	result = mockSurveyResultModel();
	params: SaveSurveyResult.Params;

	async save(data: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
		this.params = data;
		return this.result;
	}
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
	result = mockSurveyResultModel();
	surveyId: string;
	accountId: string;

	async load(surveyId: string, accountId: string): Promise<LoadSurveyResult.Result> {
		this.surveyId = surveyId;
		this.accountId = accountId;
		return this.result;
	}
}
