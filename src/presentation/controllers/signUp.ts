import { HttpRequest, HttpResponse } from "../protocols/http";
import { MissingParamError } from "../errors/missing-param-error";
import { badRequest } from "../helpers/httpHelper";
import { Controller } from "../protocols/controller";

export class SignUpController implements Controller {
	handle(httpRquest: HttpRequest): HttpResponse {
		const requiredFields = [
			"name",
			"email",
			"password",
			"password_confirmation",
		];

		for (const field of requiredFields) {
			if (!httpRquest.body[field]) {
				return badRequest(new MissingParamError(field));
			}
		}
	}
}
