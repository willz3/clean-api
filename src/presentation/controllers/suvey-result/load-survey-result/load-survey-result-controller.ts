import { CheckSurveyById } from '@/domain/usecases/survey/check-survey-by-id';
import {
	Controller,
	HttpResponse,
	InvalidParamError,
	LoadSurveyResult,
	forbidden,
	ok,
	serverError
} from './load-survey-result-controller-protocols';

export class LoadSurveyResultController
	implements Controller<LoadSurveyResultController.Request>
{
	constructor(
		private readonly checkSurveyById: CheckSurveyById,
		private readonly loadSurveyResult: LoadSurveyResult
	) {}

	async handle(request: LoadSurveyResultController.Request): Promise<HttpResponse> {
		try {
			const { surveyId, accountId } = request;
			const exists = await this.checkSurveyById.checkById(surveyId);
			if (!exists) {
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
