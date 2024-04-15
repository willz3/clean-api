import { AuthenticationModel } from '@/domain/model/authentication';

export interface Authentication {
	auth(authenticationParams: Authentication.Params): Promise<Authentication.Result>;
}

export namespace Authentication {
	export type Params = {
		email: string;
		password: string;
	};
	export type Result = AuthenticationModel;
}
