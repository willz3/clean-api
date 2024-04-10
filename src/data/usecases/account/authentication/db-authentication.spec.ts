import { mockAuthentication, throwError } from '@/domain/test';
import { DbAuthentication } from './db-authentication';
import {
	HashComparer,
	Encrypter,
	LoadAccountByEmailRepository,
	UpdateAccessTokenRepository
} from './db-authentication-protocols';
import {
	mockEncrypter,
	mockHasherComparer,
	mockLoadAccountByEmailRepository,
	mockUpdateAccessTokenRepository
} from '@/data/test';

const makeSut = (): SutTypes => {
	const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository();
	const hashComparerStub = mockHasherComparer();
	const encrypterStub = mockEncrypter();
	const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository();
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
		await sut.auth(mockAuthentication());

		expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
	});

	it('Should throw if LoadAccountByEmailRepository throws', async () => {
		const { sut, loadAccountByEmailRepositoryStub } = makeSut();
		jest
			.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
			.mockImplementationOnce(throwError);

		const promise = sut.auth(mockAuthentication());

		await expect(promise).rejects.toThrow();
	});

	it('Should return null if LoadAccountByEmailRepository returns null', async () => {
		const { sut, loadAccountByEmailRepositoryStub } = makeSut();

		jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null);

		const accessToken = await sut.auth(mockAuthentication());

		expect(accessToken).toBeNull();
	});

	it('Should call HashComparer with correct password', async () => {
		const { sut, hashComparerStub } = makeSut();
		const compareSpy = jest.spyOn(hashComparerStub, 'compare');
		await sut.auth(mockAuthentication());

		expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password');
	});

	it('Should throw if HashComparer throws', async () => {
		const { sut, hashComparerStub } = makeSut();
		jest.spyOn(hashComparerStub, 'compare').mockImplementationOnce(throwError);

		const promise = sut.auth(mockAuthentication());

		await expect(promise).rejects.toThrow();
	});

	it('Should return null if HashComparer returns false', async () => {
		const { sut, hashComparerStub } = makeSut();

		jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false));

		const accessToken = await sut.auth(mockAuthentication());

		expect(accessToken).toBeNull();
	});

	it('Should call Encrypter with correct id', async () => {
		const { sut, encrypterStub } = makeSut();
		const generateSpy = jest.spyOn(encrypterStub, 'encrypt');
		await sut.auth(mockAuthentication());

		expect(generateSpy).toHaveBeenCalledWith('any_id');
	});

	it('Should throw if encrypter throws', async () => {
		const { sut, encrypterStub } = makeSut();
		jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(throwError);

		const promise = sut.auth(mockAuthentication());

		await expect(promise).rejects.toThrow();
	});

	it('Should return an accessToken on success', async () => {
		const { sut } = makeSut();
		const accessToken = await sut.auth(mockAuthentication());

		expect(accessToken).toBe('any_token');
	});

	it('Should call UpdateAccessTokenRepository with correct values', async () => {
		const { sut, updateAccessTokenRepositoryStub } = makeSut();
		const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken');
		await sut.auth(mockAuthentication());

		expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token');
	});

	it('Should throw if UpdateAccessTokenRepository throws', async () => {
		const { sut, updateAccessTokenRepositoryStub } = makeSut();
		jest
			.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
			.mockImplementationOnce(throwError);

		const promise = sut.auth(mockAuthentication());

		await expect(promise).rejects.toThrow();
	});
});
