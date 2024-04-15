import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helper';
import {
	Controller,
	HttpResponse,
	LoadSurveys
} from './load-surveys-controller-protocols';

export class LoadSurveysController implements Controller<LoadSurveysController.Request> {
	constructor(private readonly loadSurveys: LoadSurveys) {}

	async handle(request: LoadSurveysController.Request): Promise<HttpResponse> {
		try {
			const surveys = await this.loadSurveys.load(request.accountId);
			if (surveys.length === 0) {
				return noContent();
			}
			return ok(surveys);
		} catch (error) {
			return serverError(error);
		}
	}
}

export namespace LoadSurveysController {
	export type Request = {
		accountId: string;
	};
}
