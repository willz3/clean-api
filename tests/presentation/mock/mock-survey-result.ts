import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result';
import { mockSurveyResultModel } from '../../domain/mock';
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result';

export class SaveSurveyResultSpy implements SaveSurveyResult {
	surveyResultModel = mockSurveyResultModel();
	saveSurveyResultParams: SaveSurveyResult.Params;

	async save(data: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
		this.saveSurveyResultParams = data;
		return Promise.resolve(this.surveyResultModel);
	}
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
	surveyResultModel = mockSurveyResultModel();
	surveyId: string;
	accountId: string;

	async load(surveyId: string, accountId: string): Promise<LoadSurveyResult.Result> {
		this.surveyId = surveyId;
		this.accountId = accountId;
		return Promise.resolve(this.surveyResultModel);
	}
}
