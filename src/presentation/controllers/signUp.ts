import { HttpRequest, HttpResponse } from "../protocols/http";
import { MissingParamError, InvalidParamError } from "../errors";
import { badRequest, serverError } from "../helpers/httpHelper";
import { Controller } from "../protocols/controller";
import { EmailValidator } from "../protocols/emailValidator";

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
