import { InvalidParamError, MissingParamError } from "../../errors";
import {
	badRequest,
	ok,
	serverError,
	unauthorized,
} from "../../helpers/http-helper";
import { Validation } from "../../helpers/validators/validation";
import {
	Authentication,
	Controller,
	HttpRequest,
	HttpResponse,
	EmailValidator,
} from "./login-protocols";

export class LoginController implements Controller {
	private readonly emailValidator: EmailValidator;
	private readonly authentication: Authentication;
	private readonly validation: Validation;

	constructor(
		emailValidator: EmailValidator,
		authentication: Authentication,
		validation: Validation
	) {
		this.emailValidator = emailValidator;
		this.authentication = authentication;
		this.validation = validation;
	}

	async handle(httpRquest: HttpRequest): Promise<HttpResponse> {
		try {
			const error = this.validation.validate(httpRquest.body);
			
			if (error) {
				return badRequest(error);
			}
			
			const requiredFields = ["email", "password"];
			
			for (const field of requiredFields) {
				if (!httpRquest.body[field]) {
					return badRequest(new MissingParamError(field));
				}
			}

			const { email, password } = httpRquest.body;

			const isValid = this.emailValidator.isValid(email);

			if (!isValid) {
				return badRequest(new InvalidParamError("email"));
			}

			const accessToken = await this.authentication.auth(email, password);

			if (!accessToken) {
				return unauthorized();
			}

			return ok({ accessToken });
		} catch (error) {
			return serverError(error);
		}
	}
}
