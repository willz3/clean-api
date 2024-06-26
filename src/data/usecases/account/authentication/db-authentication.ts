import {
	Authentication,
	LoadAccountByEmailRepository,
	HashComparer,
	Encrypter,
	UpdateAccessTokenRepository
} from './db-authentication-protocols';

export class DbAuthentication implements Authentication {
	constructor(
		private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
		private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
		private readonly hashComparer: HashComparer,
		private readonly encrypter: Encrypter
	) {}

	async auth(
		authenticationParams: Authentication.Params
	): Promise<Authentication.Result> {
		const account = await this.loadAccountByEmailRepository.loadByEmail(
			authenticationParams.email
		);
		if (account) {
			const isValid = await this.hashComparer.compare(
				authenticationParams.password,
				account.password
			);
			if (isValid) {
				const accessToken = await this.encrypter.encrypt(account.id);
				await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken);
				return {
					accessToken,
					name: account.name
				};
			}
		}
		return null;
	}
}
