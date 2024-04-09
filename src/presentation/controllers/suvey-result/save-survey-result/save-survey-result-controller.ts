import {
	Controller,
	HttpRequest,
	HttpResponse,
	InvalidParamError,
	LoadSurveyById,
	SaveSurveyResult,
	forbidden,
	serverError
} from './save-survey-result-controller-protocols';

export class SaveSurveyResultController implements Controller {
	constructor(
		private readonly loadSurveyById: LoadSurveyById,
		private readonly saveSurveyResult: SaveSurveyResult
	) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const { answer } = httpRequest.body;
			const { surveyId } = httpRequest.params;
			const { accountId } = httpRequest;
			const survey = await this.loadSurveyById.loadById(surveyId);

			if (!survey) {
				return forbidden(new InvalidParamError('surveyId'));
			}

			if (!survey.answers.map((data) => data.answer).includes(answer)) {
				return forbidden(new InvalidParamError('answer'));
			}

			await this.saveSurveyResult.save({
				accountId,
				surveyId,
				answer,
				date: new Date()
			});

			return null;
		} catch (error) {
			return serverError(error);
		}
	}
}
