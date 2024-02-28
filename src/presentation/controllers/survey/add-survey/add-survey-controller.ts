import { badRequest } from '../../../helpers/http/http-helper';
import {
	Controller,
	HttpRequest,
	HttpResponse,
	Validation
} from './add-survey-controller-protocols';

export class AddSurveyController implements Controller {
	constructor(private readonly validator: Validation) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const error = this.validator.validate(httpRequest.body);
		if (error) {
			return badRequest(error);
		}
		return Promise.resolve(null);
	}
}
