import { Authentication } from "../../../domain/usecases/authentication";
import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, serverError } from "../../helpers/http-helper";
import { HttpRequest, HttpResponse } from "../../protocols";
import { Controller } from "../../protocols/controller";
import { EmailValidator } from "../../protocols/email-validator";

export class LoginController implements Controller {
	private readonly emailValidator: EmailValidator;
	private readonly authentication: Authentication;

	constructor(emailValidator: EmailValidator, authentication: Authentication) {
		this.emailValidator = emailValidator;
		this.authentication = authentication;
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

			this.authentication.auth(email, password);
		} catch (error) {
			return serverError(error);
		}
	}
}
