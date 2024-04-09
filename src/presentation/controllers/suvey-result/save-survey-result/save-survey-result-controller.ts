import { forbidden, serverError } from '@/presentation/helpers/http/http-helper';
import {
	Controller,
	HttpRequest,
	HttpResponse,
	InvalidParamError,
	LoadSurveyById
} from './save-survey-result-controller-protocols';

export class SaveSurveyResultController implements Controller {
	constructor(private readonly loadSurveyById: LoadSurveyById) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const { answer } = httpRequest.body;
			const survey = await this.loadSurveyById.loadById(httpRequest.params.surveyId);
			if (!survey) {
				return forbidden(new InvalidParamError('surveyId'));
			}

			if (!survey.answers.map((data) => data.answer).includes(answer)) {
				return forbidden(new InvalidParamError('answer'));
			}

			return null;
		} catch (error) {
			return serverError(error);
		}
	}
}
