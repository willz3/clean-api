import {
	badRequest,
	ok,
	serverError,
	unauthorized
} from '@/presentation/helpers/http/http-helper';
import { Validation } from '@/presentation/protocols/validation';
import { Authentication, Controller, HttpResponse } from './login-controller-protocols';

export class LoginController implements Controller<LoginController.Request> {
	constructor(
		private readonly authentication: Authentication,
		private readonly validation: Validation
	) {}

	async handle(request: LoginController.Request): Promise<HttpResponse> {
		try {
			const error = this.validation.validate(request);

			if (error) {
				return badRequest(error);
			}

			const { email, password } = request;

			const authenticationModel = await this.authentication.auth({ email, password });

			if (!authenticationModel) {
				return unauthorized();
			}

			return ok(authenticationModel);
		} catch (error) {
			return serverError(error);
		}
	}
}

export namespace LoginController {
	export type Request = {
		email: string;
		password: string;
	};
}
