import { Decrypter } from '../../protocols/criptography/decrypter';
import { DbLoadAccountByToken } from './load-account-by-token';

describe('DbLoadAccountByToken use case', () => {
	test('Should call Decrypter with correct values', async () => {
		const { sut, decrypterStub } = makeSut();
		const decryptSpy = jest.spyOn(decrypterStub, 'decrypt');
		await sut.load('any_token', 'any_role');
		expect(decryptSpy).toHaveBeenCalledWith('any_token');
	});

	test('Should return null if Decrypter returns null', async () => {
		const { sut, decrypterStub } = makeSut();
		jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(Promise.resolve(null));
		const result = await sut.load('any_token', 'any_role');
		expect(result).toBeNull();
	});
});

type SutTypes = {
	sut: DbLoadAccountByToken;
	decrypterStub: Decrypter;
};

const makeDecrypterStub = (): Decrypter => {
	class DecrypterStub implements Decrypter {
		decrypt(value: string): Promise<string> {
			return Promise.resolve('any_token');
		}
	}
	return new DecrypterStub();
};

const makeSut = (): SutTypes => {
	const decrypterStub = makeDecrypterStub();
	const sut = new DbLoadAccountByToken(decrypterStub);

	return {
		sut,
		decrypterStub
	};
};
