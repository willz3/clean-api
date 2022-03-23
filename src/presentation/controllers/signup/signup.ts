import {
	HttpRequest,
	HttpResponse,
	Controller,
	EmailValidator,
	AddAccount,
} from "./signup-protocols";
import { MissingParamError, InvalidParamError } from "../../errors";
import { badRequest, ok, serverError } from "../../helpers/http-helper";

export class SignUpController implements Controller {
	private readonly emailValidator: EmailValidator;
	private readonly addAccount: AddAccount;

	constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
		this.emailValidator = emailValidator;
		this.addAccount = addAccount;
	}

	async handle(httpRquest: HttpRequest): Promise<HttpResponse> {
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

			const { name, email, password, password_confirmation } = httpRquest.body;

			if (password !== password_confirmation) {
				return badRequest(new InvalidParamError("password_confirmation"));
			}

			const isValid = this.emailValidator.isValid(email);
			if (!isValid) {
				return badRequest(new InvalidParamError("email"));
			}

			const account = await this.addAccount.add({
				name,
				email,
				password,
			});

			return ok(account);
		} catch (error) {
			return serverError(error);
		}
	}
}
