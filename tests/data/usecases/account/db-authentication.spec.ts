import { DbAuthentication } from '@/data/usecases/account/authentication/db-authentication';
import {
	HashComparerSpy,
	EncrypterSpy,
	UpdateAccessTokenRepositorySpy,
	LoadAccountByEmailRepositorySpy
} from '@/tests/data/mock';
import { throwError, mockAuthenticationParams } from '@/tests/domain/mock';

type SutTypes = {
	sut: DbAuthentication;
	loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy;
	hashComparerSpy: HashComparerSpy;
	encrypterSpy: EncrypterSpy;
	updateAccessTokenRepositorySpy: UpdateAccessTokenRepositorySpy;
};

const makeSut = (): SutTypes => {
	const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy();
	const hashComparerSpy = new HashComparerSpy();
	const encrypterSpy = new EncrypterSpy();
	const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy();
	const sut = new DbAuthentication(
		loadAccountByEmailRepositorySpy,
		updateAccessTokenRepositorySpy,
		hashComparerSpy,
		encrypterSpy
	);
	return {
		sut,
		loadAccountByEmailRepositorySpy,
		hashComparerSpy,
		encrypterSpy,
		updateAccessTokenRepositorySpy
	};
};

describe('DbAuthentication UseCase', () => {
	test('Should call LoadAccountByEmailRepository with correct email', async () => {
		const { sut, loadAccountByEmailRepositorySpy } = makeSut();
		const authenticationParams = mockAuthenticationParams();
		await sut.auth(authenticationParams);
		expect(loadAccountByEmailRepositorySpy.email).toBe(authenticationParams.email);
	});

	test('Should throw if LoadAccountByEmailRepository throws', async () => {
		const { sut, loadAccountByEmailRepositorySpy } = makeSut();
		jest
			.spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail')
			.mockImplementationOnce(throwError);
		const promise = sut.auth(mockAuthenticationParams());
		await expect(promise).rejects.toThrow();
	});

	test('Should return null if LoadAccountByEmailRepository returns null', async () => {
		const { sut, loadAccountByEmailRepositorySpy } = makeSut();
		loadAccountByEmailRepositorySpy.result = null;
		const model = await sut.auth(mockAuthenticationParams());
		expect(model).toBeNull();
	});

	test('Should call HashComparer with correct values', async () => {
		const { sut, hashComparerSpy, loadAccountByEmailRepositorySpy } = makeSut();
		const authenticationParams = mockAuthenticationParams();
		await sut.auth(authenticationParams);
		expect(hashComparerSpy.plaintext).toBe(authenticationParams.password);
		expect(hashComparerSpy.digest).toBe(loadAccountByEmailRepositorySpy.result.password);
	});

	test('Should throw if HashComparer throws', async () => {
		const { sut, hashComparerSpy } = makeSut();
		jest.spyOn(hashComparerSpy, 'compare').mockImplementationOnce(throwError);
		const promise = sut.auth(mockAuthenticationParams());
		await expect(promise).rejects.toThrow();
	});

	test('Should return null if HashComparer returns false', async () => {
		const { sut, hashComparerSpy } = makeSut();
		hashComparerSpy.isValid = false;
		const model = await sut.auth(mockAuthenticationParams());
		expect(model).toBeNull();
	});

	test('Should call Encrypter with correct plaintext', async () => {
		const { sut, encrypterSpy, loadAccountByEmailRepositorySpy } = makeSut();
		await sut.auth(mockAuthenticationParams());
		expect(encrypterSpy.plaintext).toBe(loadAccountByEmailRepositorySpy.result.id);
	});

	test('Should throw if Encrypter throws', async () => {
		const { sut, encrypterSpy } = makeSut();
		jest.spyOn(encrypterSpy, 'encrypt').mockImplementationOnce(throwError);
		const promise = sut.auth(mockAuthenticationParams());
		await expect(promise).rejects.toThrow();
	});

	test('Should return an authentication model on success', async () => {
		const { sut, encrypterSpy, loadAccountByEmailRepositorySpy } = makeSut();
		const { accessToken, name } = await sut.auth(mockAuthenticationParams());
		expect(accessToken).toBe(encrypterSpy.ciphertext);
		expect(name).toBe(loadAccountByEmailRepositorySpy.result.name);
	});

	test('Should call UpdateAccessTokenRepository with correct values', async () => {
		const {
			sut,
			updateAccessTokenRepositorySpy,
			loadAccountByEmailRepositorySpy,
			encrypterSpy
		} = makeSut();
		await sut.auth(mockAuthenticationParams());
		expect(updateAccessTokenRepositorySpy.id).toBe(
			loadAccountByEmailRepositorySpy.result.id
		);
		expect(updateAccessTokenRepositorySpy.token).toBe(encrypterSpy.ciphertext);
	});

	test('Should throw if UpdateAccessTokenRepository throws', async () => {
		const { sut, updateAccessTokenRepositorySpy } = makeSut();
		jest
			.spyOn(updateAccessTokenRepositorySpy, 'updateAccessToken')
			.mockImplementationOnce(throwError);
		const promise = sut.auth(mockAuthenticationParams());
		await expect(promise).rejects.toThrow();
	});
});
