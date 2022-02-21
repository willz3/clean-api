import {
	HttpRequest,
	HttpResponse,
	Controller,
	EmailValidator,
} from "../protocols";
import { MissingParamError, InvalidParamError } from "../errors";
import { badRequest, serverError } from "../helpers/httpHelper";
import { AddAccount } from "../../domain/usecases/add-account";

export class SignUpController implements Controller {
	private readonly emailValidator: EmailValidator;
	private readonly addAccount: AddAccount;

	constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
		this.emailValidator = emailValidator;
		this.addAccount = addAccount;
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

			const { name, email, password, password_confirmation } = httpRquest.body;

			if (password !== password_confirmation) {
				return badRequest(new InvalidParamError("password_confirmation"));
			}

			const isValid = this.emailValidator.isValid(email);
			if (!isValid) {
				return badRequest(new InvalidParamError("email"));
			}

			this.addAccount.add({
				name,
				email,
				password,
			});
		} catch (error) {
			return serverError();
		}
	}
}
