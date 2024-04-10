import { mockAccountModel, throwError } from '@/domain/test';
import { DbLoadAccountByToken } from './load-account-by-token';
import {
	Decrypter,
	LoadAccountByTokenRepository
} from './load-account-by-token-protocols';
import { mockDecrypter, mockLoadAccountByTokenRepository } from '@/data/test';

describe('DbLoadAccountByToken use case', () => {
	test('Should call Decrypter with correct values', async () => {
		const { sut, decrypterStub } = makeSut();
		const decryptSpy = jest.spyOn(decrypterStub, 'decrypt');
		await sut.loadByToken('any_token', 'any_role');
		expect(decryptSpy).toHaveBeenCalledWith('any_token');
	});

	test('Should return null if Decrypter returns null', async () => {
		const { sut, decrypterStub } = makeSut();
		jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(Promise.resolve(null));
		const result = await sut.loadByToken('any_token', 'any_role');
		expect(result).toBeNull();
	});

	test('Should call LoadAccountByTokenRepository with correct values', async () => {
		const { sut, loadAccountByTokenRepositoryStub } = makeSut();
		const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken');
		await sut.loadByToken('any_token', 'any_role');
		expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role');
	});

	test('Should return null if LoadAccountByTokenRepository returns null', async () => {
		const { sut, loadAccountByTokenRepositoryStub } = makeSut();
		jest
			.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
			.mockReturnValueOnce(Promise.resolve(null));
		const result = await sut.loadByToken('any_token', 'any_role');
		expect(result).toBeNull();
	});

	test('Should return an account on success', async () => {
		const { sut } = makeSut();
		const result = await sut.loadByToken('any_token', 'any_role');
		expect(result).toEqual(mockAccountModel());
	});

	test('Should throw if Decrypter throws', async () => {
		const { sut, decrypterStub } = makeSut();
		jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(throwError);
		const result = sut.loadByToken('any_token', 'any_role');
		expect(result).rejects.toThrow();
	});
});

type SutTypes = {
	sut: DbLoadAccountByToken;
	decrypterStub: Decrypter;
	loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository;
};

const makeSut = (): SutTypes => {
	const decrypterStub = mockDecrypter();
	const loadAccountByTokenRepositoryStub = mockLoadAccountByTokenRepository();
	const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub);

	return {
		sut,
		decrypterStub,
		loadAccountByTokenRepositoryStub
	};
};
