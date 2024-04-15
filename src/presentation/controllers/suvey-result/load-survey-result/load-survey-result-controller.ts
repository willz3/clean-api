import {
	Controller,
	HttpResponse,
	InvalidParamError,
	LoadSurveyById,
	LoadSurveyResult,
	forbidden,
	ok,
	serverError
} from './load-survey-result-controller-protocols';

export class LoadSurveyResultController
	implements Controller<LoadSurveyResultController.Request>
{
	constructor(
		private readonly loadSurveyById: LoadSurveyById,
		private readonly loadSurveyResult: LoadSurveyResult
	) {}

	async handle(request: LoadSurveyResultController.Request): Promise<HttpResponse> {
		try {
			const { surveyId, accountId } = request;
			const survey = await this.loadSurveyById.loadById(surveyId);
			if (!survey) {
				return forbidden(new InvalidParamError('surveyId'));
			}
			const surveyResult = await this.loadSurveyResult.load(surveyId, accountId);
			return ok(surveyResult);
		} catch (error) {
			return serverError(error);
		}
	}
}

export namespace LoadSurveyResultController {
	export type Request = {
		surveyId: string;
		accountId: string;
	};
}
