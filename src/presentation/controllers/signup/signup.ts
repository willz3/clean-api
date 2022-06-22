import {
	HttpRequest,
	HttpResponse,
	Controller,
	AddAccount,
} from "./signup-protocols";
import { badRequest, ok, serverError } from "../../helpers/http-helper";
import { Validation } from "../../helpers/validators/validation";

export class SignUpController implements Controller {
	private readonly addAccount: AddAccount;
	private readonly validation: Validation;

	constructor(addAccount: AddAccount, validation: Validation) {
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
