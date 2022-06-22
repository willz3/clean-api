import {
	HttpRequest,
	HttpResponse,
	Controller,
	EmailValidator,
	AddAccount,
} from "./signup-protocols";
import { MissingParamError, InvalidParamError } from "../../errors";
import { badRequest, ok, serverError } from "../../helpers/http-helper";
import { Validation } from "../../helpers/validators/validation";

export class SignUpController implements Controller {
	private readonly emailValidator: EmailValidator;
	private readonly addAccount: AddAccount;
	private readonly validation: Validation;

	constructor(
		emailValidator: EmailValidator,
		addAccount: AddAccount,
		validation: Validation
	) {
		this.emailValidator = emailValidator;
		this.addAccount = addAccount;
		this.validation = validation;
	}

	async handle(httpRquest: HttpRequest): Promise<HttpResponse> {
		try {
			const error = this.validation.validate(httpRquest.body);

			if (error) {
				return badRequest(error);
			}

			const { name, email, password } = httpRquest.body;

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
