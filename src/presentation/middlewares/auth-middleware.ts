import { AccessDeniedError } from '@/presentation/errors';
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper';
import {
	Middleware,
	HttpResponse,
	LoadAccountByToken
} from './auth-middleware-protocols';

export class AuthMiddleware implements Middleware<AuthMiddleware.Request> {
	constructor(
		private readonly loadAccountByToken: LoadAccountByToken,
		private readonly role?: string
	) {}

	async handle(request: AuthMiddleware.Request): Promise<HttpResponse> {
		try {
			const accessToken = request.accessToken;

			if (!accessToken) {
				return forbidden(new AccessDeniedError());
			}

			const account = await this.loadAccountByToken.load(accessToken, this.role);
			if (!account) {
				return forbidden(new AccessDeniedError());
			}

			return ok({ accountId: account.id });
		} catch (error) {
			return serverError(error);
		}
	}
}

export namespace AuthMiddleware {
	export type Request = {
		accessToken?: string;
	};
}
