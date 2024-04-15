import {
	Controller,
	HttpResponse,
	InvalidParamError,
	LoadSurveyById,
	SaveSurveyResult,
	forbidden,
	ok,
	serverError
} from './save-survey-result-controller-protocols';

export class SaveSurveyResultController
	implements Controller<SaveSurveyResultController.Request>
{
	constructor(
		private readonly loadSurveyById: LoadSurveyById,
		private readonly saveSurveyResult: SaveSurveyResult
	) {}

	async handle(request: SaveSurveyResultController.Request): Promise<HttpResponse> {
		try {
			const { surveyId, answer, accountId } = request;
			const survey = await this.loadSurveyById.loadById(surveyId);

			if (!survey) {
				return forbidden(new InvalidParamError('surveyId'));
			}

			if (!survey.answers.map((data) => data.answer).includes(answer)) {
				return forbidden(new InvalidParamError('answer'));
			}

			const surveyResult = await this.saveSurveyResult.save({
				accountId,
				surveyId,
				answer,
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
