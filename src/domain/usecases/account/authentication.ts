import { AuthenticationModel } from '@/domain/model/authentication';

export type AuthenticationParams = {
	email: string;
	password: string;
};

export interface Authentication {
	auth(authenticationParams: AuthenticationParams): Promise<AuthenticationModel>;
}
