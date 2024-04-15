import { LoadSurveyResultRepository } from '../load-survey-result/db-load-survey-result-protocols';
import {
	SaveSurveyResult,
	SaveSurveyResultRepository
} from './db-save-survey-result-protocols';

export class DbSaveSurveyResult implements SaveSurveyResult {
	constructor(
		private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
		private readonly loadSurveyResultRepository: LoadSurveyResultRepository
	) {}

	async save(data: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
		await this.saveSurveyResultRepository.save(data);
		return await this.loadSurveyResultRepository.loadBySurveyId(
			data.surveyId,
			data.accountId
		);
	}
}
