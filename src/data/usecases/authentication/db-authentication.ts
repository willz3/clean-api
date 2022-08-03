import {
	Authentication,
	LoadAccountByEmailRepository,
	UpdateAccessTokenRepository,
	HashComparer,
	Encrypter,
	AuthenticationModel,
} from "./db-authentication-protocols";

export class DbAuthentication implements Authentication {
	private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;
	private readonly updateAccessTokenRepository: UpdateAccessTokenRepository;
	private readonly hashComparer: HashComparer;
	private readonly encrypter: Encrypter;

	constructor(
		loadAccountByEmailRepository: LoadAccountByEmailRepository,
		updateAccessTokenRepository: UpdateAccessTokenRepository,
		hashComparer: HashComparer,
		encrypter: Encrypter
	) {
		this.loadAccountByEmailRepository = loadAccountByEmailRepository;
		this.hashComparer = hashComparer;
		this.encrypter = encrypter;
		this.updateAccessTokenRepository = updateAccessTokenRepository;
	}

	async auth(authentication: AuthenticationModel): Promise<string> {
		const account = await this.loadAccountByEmailRepository.load(
			authentication.email
		);

		if (!account) {
			return null;
		}

		const isValid = await this.hashComparer.compare(
			authentication.password,
			account.password
		);

		if (!isValid) {
			return null;
		}

		const accessToken = await this.encrypter.encrypt(account.id);
		await this.updateAccessTokenRepository.update(account.id, accessToken);

		return accessToken;
	}
}
