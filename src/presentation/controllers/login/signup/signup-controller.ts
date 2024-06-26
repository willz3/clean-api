import {
	HttpResponse,
	Controller,
	AddAccount,
	Authentication
} from './signup-controller-protocols';
import {
	badRequest,
	forbidden,
	ok,
	serverError
} from '@/presentation/helpers/http/http-helper';
import { Validation } from '@/presentation/protocols';
import { EmailInUseError } from '@/presentation/errors';

export class SignUpController implements Controller<SignUpController.Request> {
	constructor(
		private readonly addAccount: AddAccount,
		private readonly validation: Validation,
		private readonly authentication: Authentication
	) {}

	async handle(request: SignUpController.Request): Promise<HttpResponse> {
		try {
			const error = this.validation.validate(request);

			if (error) {
				return badRequest(error);
			}

			const { name, email, password } = request;

			const isValid = await this.addAccount.add({
				name,
				email,
				password
			});

			if (!isValid) {
				return forbidden(new EmailInUseError());
			}

			const authenticationModel = await this.authentication.auth({ email, password });

			return ok(authenticationModel);
		} catch (error) {
			return serverError(error);
		}
	}
}

export namespace SignUpController {
	export type Request = {
		name: string;
		email: string;
		password: string;
		passwordConfirmation: string;
	};
}
