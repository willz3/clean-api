import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository';
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository';
import { mockSurveyResultModel } from '../../domain/mock';

export class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
	saveSurveyResultParams: SaveSurveyResultRepository.Params;

	async save(
		data: SaveSurveyResultRepository.Params
	): Promise<SaveSurveyResultRepository.Result> {
		this.saveSurveyResultParams = data;
		return Promise.resolve();
	}
}

export class LoadSurveyResultRepositorySpy implements LoadSurveyResultRepository {
	surveyResultModel = mockSurveyResultModel();
	surveyId: string;
	accountId: string;

	async loadBySurveyId(
		surveyId: string,
		accountId: string
	): Promise<LoadSurveyResultRepository.Result> {
		this.surveyId = surveyId;
		this.accountId = accountId;
		return Promise.resolve(this.surveyResultModel);
	}
}
