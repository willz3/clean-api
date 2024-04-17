import {
	LoadAnswersBySurvey,
	LoadAnswersBySurveyRepository
} from './db-load-answers-by-survey-protocols';

export class DbLoadAnswersBySurvey implements LoadAnswersBySurvey {
	constructor(
		private readonly loadAnswersBySurveyRepository: LoadAnswersBySurveyRepository
	) {}

	async loadAnswers(id: LoadAnswersBySurvey.Param): Promise<LoadAnswersBySurvey.Result> {
		return this.loadAnswersBySurveyRepository.loadAnswers(id);
	}
}
