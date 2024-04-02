import { AccountModel } from '../../../domain/model/account';
import { Decrypter } from '../../protocols/criptography/decrypter';
import { DbLoadAccountByToken } from './load-account-by-token';
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository';

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
		expect(result).toEqual(makeFakeAccount());
	});

	test('Should throw if Decrypter throws', async () => {
		const { sut, decrypterStub } = makeSut();
		jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(Promise.reject(new Error()));
		const result = sut.loadByToken('any_token', 'any_role');
		expect(result).rejects.toThrow();
	});
});

type SutTypes = {
	sut: DbLoadAccountByToken;
	decrypterStub: Decrypter;
	loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository;
};

const makeDecrypterStub = (): Decrypter => {
	class DecrypterStub implements Decrypter {
		decrypt(value: string): Promise<string> {
			return Promise.resolve('any_token');
		}
	}
	return new DecrypterStub();
};

const makeFakeAccount = (): AccountModel => {
	return {
		id: 'valid_id',
		name: 'valid_name',
		email: 'valid_email@mail.com',
		password: 'hashed_password'
	};
};

const makeLoadAccountByTokenRepositoryStub = (): LoadAccountByTokenRepository => {
	class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
		loadByToken(token: string, role?: string): Promise<AccountModel | null> {
			return Promise.resolve(makeFakeAccount());
		}
	}
	return new LoadAccountByTokenRepositoryStub();
};

const makeSut = (): SutTypes => {
	const decrypterStub = makeDecrypterStub();
	const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepositoryStub();
	const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub);

	return {
		sut,
		decrypterStub,
		loadAccountByTokenRepositoryStub
	};
};
