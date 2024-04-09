import { DbAuthentication } from './db-authentication';
import {
	HashComparer,
	Encrypter,
	AuthenticationParams,
	AccountModel,
	LoadAccountByEmailRepository,
	UpdateAccessTokenRepository
} from './db-authentication-protocols';

const makeFakeAccount = (): AccountModel => {
	return {
		id: 'any_id',
		name: 'any_name',
		email: 'any_email',
		password: 'hashed_password'
	};
};

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
	class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
		async loadByEmail(email: string): Promise<AccountModel> {
			return Promise.resolve(makeFakeAccount());
		}
	}

	return new LoadAccountByEmailRepositoryStub();
};

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
	class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
		async updateAccessToken(id: string, token: string): Promise<void> {
			return Promise.resolve();
		}
	}

	return new UpdateAccessTokenRepositoryStub();
};

const makeHashComparer = (): HashComparer => {
	class HashComparerStub implements HashComparer {
		async compare(value: string, hash: string): Promise<boolean> {
			return Promise.resolve(true);
		}
	}

	return new HashComparerStub();
};

const makeEncrypter = (): Encrypter => {
	class EncrypterStub implements Encrypter {
		async encrypt(id: string): Promise<string> {
			return Promise.resolve('any_token');
		}
	}

	return new EncrypterStub();
};

const makeFakeAuthentication = (): AuthenticationParams => {
	return {
		email: 'any_email@mail.com',
		password: 'any_password'
	};
};

const makeSut = (): SutTypes => {
	const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
	const hashComparerStub = makeHashComparer();
	const encrypterStub = makeEncrypter();
	const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository();
	const sut = new DbAuthentication(
		loadAccountByEmailRepositoryStub,
		updateAccessTokenRepositoryStub,
		hashComparerStub,
		encrypterStub
	);

	return {
		sut,
		loadAccountByEmailRepositoryStub,
		hashComparerStub,
		encrypterStub,
		updateAccessTokenRepositoryStub
	};
};

type SutTypes = {
	sut: DbAuthentication;
	loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
	hashComparerStub: HashComparer;
	encrypterStub: Encrypter;
	updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
};

describe('DbAuthentication UseCase', () => {
	it('Should call LoadAccountByEmailRepository with correct email', async () => {
		const { sut, loadAccountByEmailRepositoryStub } = makeSut();
		const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');
		await sut.auth(makeFakeAuthentication());

		expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
	});

	it('Should throw if LoadAccountByEmailRepository throws', async () => {
		const { sut, loadAccountByEmailRepositoryStub } = makeSut();
		jest
			.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
			.mockReturnValueOnce(Promise.reject(new Error()));

		const promise = sut.auth(makeFakeAuthentication());

		await expect(promise).rejects.toThrow();
	});

	it('Should return null if LoadAccountByEmailRepository returns null', async () => {
		const { sut, loadAccountByEmailRepositoryStub } = makeSut();

		jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null);

		const accessToken = await sut.auth(makeFakeAuthentication());

		expect(accessToken).toBeNull();
	});

	it('Should call HashComparer with correct password', async () => {
		const { sut, hashComparerStub } = makeSut();
		const compareSpy = jest.spyOn(hashComparerStub, 'compare');
		await sut.auth(makeFakeAuthentication());

		expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password');
	});

	it('Should throw if HashComparer throws', async () => {
		const { sut, hashComparerStub } = makeSut();
		jest
			.spyOn(hashComparerStub, 'compare')
			.mockReturnValueOnce(Promise.reject(new Error()));

		const promise = sut.auth(makeFakeAuthentication());

		await expect(promise).rejects.toThrow();
	});

	it('Should return null if HashComparer returns false', async () => {
		const { sut, hashComparerStub } = makeSut();

		jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false));

		const accessToken = await sut.auth(makeFakeAuthentication());

		expect(accessToken).toBeNull();
	});

	it('Should call Encrypter with correct id', async () => {
		const { sut, encrypterStub } = makeSut();
		const generateSpy = jest.spyOn(encrypterStub, 'encrypt');
		await sut.auth(makeFakeAuthentication());

		expect(generateSpy).toHaveBeenCalledWith('any_id');
	});

	it('Should throw if encrypter throws', async () => {
		const { sut, encrypterStub } = makeSut();
		jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()));

		const promise = sut.auth(makeFakeAuthentication());

		await expect(promise).rejects.toThrow();
	});

	it('Should return an accessToken on success', async () => {
		const { sut } = makeSut();
		const accessToken = await sut.auth(makeFakeAuthentication());

		expect(accessToken).toBe('any_token');
	});

	it('Should call UpdateAccessTokenRepository with correct values', async () => {
		const { sut, updateAccessTokenRepositoryStub } = makeSut();
		const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken');
		await sut.auth(makeFakeAuthentication());

		expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token');
	});

	it('Should throw if UpdateAccessTokenRepository throws', async () => {
		const { sut, updateAccessTokenRepositoryStub } = makeSut();
		jest
			.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
			.mockReturnValueOnce(Promise.reject(new Error()));

		const promise = sut.auth(makeFakeAuthentication());

		await expect(promise).rejects.toThrow();
	});
});
