import { AddSurvey, AddSurveyRepository } from './db-add-survey-protocols';

export class DbAddSurvey implements AddSurvey {
	constructor(private readonly addSurveyRepository: AddSurveyRepository) {}

	async add(survey: AddSurvey.Params): Promise<AddSurvey.Result> {
		await this.addSurveyRepository.add(survey);
		return Promise.resolve();
	}
}
