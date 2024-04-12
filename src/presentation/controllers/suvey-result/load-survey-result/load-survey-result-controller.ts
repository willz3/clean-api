import {
	Controller,
	HttpRequest,
	HttpResponse,
	InvalidParamError,
	LoadSurveyById,
	forbidden,
	serverError
} from './load-survey-result-controller-protocols';

export class LoadSurveyResultController implements Controller {
	constructor(private readonly loadSurveyById: LoadSurveyById) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const survey = await this.loadSurveyById.loadById(httpRequest.params.surveyId);
			if (!survey) {
				return forbidden(new InvalidParamError('surveyId'));
			}
			return null;
		} catch (error) {
			return serverError(error);
		}
	}
}