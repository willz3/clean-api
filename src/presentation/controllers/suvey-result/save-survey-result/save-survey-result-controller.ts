import { forbidden } from '@/presentation/helpers/http/http-helper';
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
		const survey = await this.loadSurveyById.loadById(httpRequest.params.surveyId);
		if (survey == null) {
			return forbidden(new InvalidParamError('surveyId'));
		}
		return null;
	}
}
