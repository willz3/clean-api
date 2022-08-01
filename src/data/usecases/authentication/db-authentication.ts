import {
	Authentication,
	LoadAccountByEmailRepository,
	UpdateAccessTokenRepository,
	HashComparer,
	TokenGenerator,
	AuthenticationModel,
} from "./db-authentication-protocols";

export class DbAuthentication implements Authentication {
	private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;
	private readonly updateAccessTokenRepository: UpdateAccessTokenRepository;
	private readonly hashComparer: HashComparer;
	private readonly tokenGenerator: TokenGenerator;

	constructor(
		loadAccountByEmailRepository: LoadAccountByEmailRepository,
		updateAccessTokenRepository: UpdateAccessTokenRepository,
		hashComparer: HashComparer,
		tokenGenerator: TokenGenerator
	) {
		this.loadAccountByEmailRepository = loadAccountByEmailRepository;
		this.hashComparer = hashComparer;
		this.tokenGenerator = tokenGenerator;
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

		const accessToken = await this.tokenGenerator.generate(account.id);
		await this.updateAccessTokenRepository.update(account.id, accessToken);

		return accessToken;
	}
}
