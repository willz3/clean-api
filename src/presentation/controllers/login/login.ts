import { MissingParamError } from "../../errors";
import { badRequest } from "../../helpers/http-helper";
import { HttpRequest, HttpResponse } from "../../protocols";
import { Controller } from "../../protocols/controller";
import { EmailValidator } from "../../protocols/email-validator";

export class LoginController implements Controller {
	private readonly emailValidator: EmailValidator;

	constructor(emailValidator: EmailValidator) {
		this.emailValidator = emailValidator;
	}

	async handle(httpRquest: HttpRequest): Promise<HttpResponse> {
		if (!httpRquest.body.email) {
			return new Promise<HttpResponse>((resolve, reject) =>
				resolve(badRequest(new MissingParamError("email")))
			);
		}

		if (!httpRquest.body.password) {
			return new Promise<HttpResponse>((resolve, reject) =>
				resolve(badRequest(new MissingParamError("password")))
			);
		}

		this.emailValidator.isValid(httpRquest.body.email);
	}
}
