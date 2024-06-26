import bcrypt from 'bcrypt';
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter';

jest.mock('bcrypt', () => ({
	async hash(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			resolve('hash');
		});
	},

	async compare(): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			resolve(true);
		});
	}
}));

const salt = 12;

const makeSut = (): BcryptAdapter => {
	return new BcryptAdapter(salt);
};

describe('BCrypt Adapter', () => {
	describe('Hash()', () => {
		test('Should call hash with correct values', async () => {
			const sut = makeSut();
			const hashSpy = jest.spyOn(bcrypt, 'hash');
			await sut.hash('any_value');
			expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
		});

		test('Should throw if hash throws', async () => {
			const sut = makeSut();
			jest
				.spyOn(bcrypt, 'hash')
				.mockImplementationOnce(() => Promise.reject(new Error()));
			const promise = sut.hash('any_value');
			expect(promise).rejects.toThrow();
		});

		test('Should return a valid hash on hash success', async () => {
			const sut = makeSut();
			const hash = await sut.hash('any_value');

			expect(hash).toBe('hash');
		});
	});

	describe('compare()', () => {
		test('Should return true when compare succeeds', async () => {
			const sut = makeSut();
			const isValid = await sut.compare('any_value', 'any_hash');
			expect(isValid).toBeTruthy();
		});

		test('Should return false when compare fails', async () => {
			const sut = makeSut();
			jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(false));

			const isValid = await sut.compare('any_value', 'any_hash');
			expect(isValid).toBeFalsy();
		});

		test('Should throw if compare throws', async () => {
			const sut = makeSut();
			jest
				.spyOn(bcrypt, 'compare')
				.mockImplementationOnce(() => Promise.reject(new Error()));
			const promise = sut.compare('any_value', 'any_hash');
			expect(promise).rejects.toThrow();
		});

		test('Should call compare with correct values', async () => {
			const sut = makeSut();
			const hashSpy = jest.spyOn(bcrypt, 'compare');
			await sut.compare('any_value', 'any_hash');
			expect(hashSpy).toHaveBeenCalledWith('any_value', 'any_hash');
		});
	});
});
