import {
	Controller,
	HttpResponse,
	InvalidParamError,
	LoadAnswersBySurvey,
	SaveSurveyResult,
	forbidden,
	ok,
	serverError
} from './save-survey-result-controller-protocols';

export class SaveSurveyResultController
	implements Controller<SaveSurveyResultController.Request>
{
	constructor(
		private readonly loadAnswersBySurvey: LoadAnswersBySurvey,
		private readonly saveSurveyResult: SaveSurveyResult
	) {}

	async handle(request: SaveSurveyResultController.Request): Promise<HttpResponse> {
		try {
			const { surveyId, answer, accountId } = request;
			const answers = await this.loadAnswersBySurvey.loadAnswers(surveyId);

			if (answers.length === 0) {
				return forbidden(new InvalidParamError('surveyId'));
			} else if (!answers.includes(answer)) {
				return forbidden(new InvalidParamError('answer'));
			}

			const surveyResult = await this.saveSurveyResult.save({
				...request,
				date: new Date()
			});

			return ok(surveyResult);
		} catch (error) {
			return serverError(error);
		}
	}
}

export namespace SaveSurveyResultController {
	export type Request = {
		surveyId: string;
		accountId: string;
		answer: string;
	};
}
