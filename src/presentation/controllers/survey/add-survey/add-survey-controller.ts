import {
	Controller,
	HttpRequest,
	HttpResponse,
	Validation
} from './add-survey-controller-protocols';

export class AddSurveyController implements Controller {
	constructor(private readonly validator: Validation) {}

	handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		this.validator.validate(httpRequest.body);
		return Promise.resolve(null);
	}
}
