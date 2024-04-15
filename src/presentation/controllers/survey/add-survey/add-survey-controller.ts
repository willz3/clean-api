import {
	badRequest,
	noContent,
	serverError
} from '@/presentation/helpers/http/http-helper';
import {
	AddSurvey,
	Controller,
	HttpResponse,
	Validation
} from './add-survey-controller-protocols';

export class AddSurveyController implements Controller<AddSurveyController.Request> {
	constructor(
		private readonly validator: Validation,
		private readonly addSurvey: AddSurvey
	) {}

	async handle(request: AddSurveyController.Request): Promise<HttpResponse> {
		try {
			const error = this.validator.validate(request);
			if (error) {
				return badRequest(error);
			}

			const { question, answers } = request;

			await this.addSurvey.add({
				question,
				answers,
				date: new Date()
			});

			return noContent();
		} catch (error) {
			return serverError(error);
		}
	}
}

export namespace AddSurveyController {
	export type Request = {
		question: string;
		answers: Array<Answer>;
	};

	type Answer = {
		image?: string;
		answer: string;
	};
}
