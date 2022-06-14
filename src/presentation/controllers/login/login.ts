import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, serverError } from "../../helpers/http-helper";
import { HttpRequest, HttpResponse } from "../../protocols";
import { Controller } from "../../protocols/controller";
import { EmailValidator } from "../../protocols/email-validator";

export class LoginController implements Controller {
	private readonly emailValidator: EmailValidator;

	constructor(emailValidator: EmailValidator) {
		this.emailValidator = emailValidator;
	}

	async handle(httpRquest: HttpRequest): Promise<HttpResponse> {
		try {
			const { email, password } = httpRquest.body;
			if (!email) {
				return new Promise<HttpResponse>((resolve, reject) =>
					resolve(badRequest(new MissingParamError("email")))
				);
			}

			if (!password) {
				return new Promise<HttpResponse>((resolve, reject) =>
					resolve(badRequest(new MissingParamError("password")))
				);
			}

			const isValid = this.emailValidator.isValid(email);

			if (!isValid) {
				return new Promise<HttpResponse>((resolve, reject) =>
					resolve(badRequest(new InvalidParamError("email")))
				);
			}
		} catch (error) {
			return serverError(error);
		}
	}
}
