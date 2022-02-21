import { HttpRequest, HttpResponse } from "../protocols/http";
import { MissingParamError } from "../errors/missing-param-error";
import { badRequest, serverError } from "../helpers/httpHelper";
import { Controller } from "../protocols/controller";
import { EmailValidator } from "../protocols/emailValidator";
import { InvalidParamError } from "../errors/invalid-param-error";
import { ServerError } from "../errors/server-error";

export class SignUpController implements Controller {
	private readonly emailValidator: EmailValidator;

	constructor(emailValidator: EmailValidator) {
		this.emailValidator = emailValidator;
	}

	handle(httpRquest: HttpRequest): HttpResponse {
		try {
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

			const isValid = this.emailValidator.isValid(httpRquest.body.email);
			if (!isValid) {
				return badRequest(new InvalidParamError("email"));
			}
		} catch (error) {
			return serverError();
		}
	}
}
