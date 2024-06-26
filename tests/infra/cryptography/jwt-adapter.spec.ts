import jwt from 'jsonwebtoken';
import { JwtAdapter } from '@/infra/criptography/jwt-adapter/jwt-adapter';

jest.mock('jsonwebtoken', () => ({
	async sign(): Promise<string> {
		return Promise.resolve('any_token');
	},

	async verify(): Promise<string> {
		return Promise.resolve('any_value');
	}
}));

const makeSut = (): JwtAdapter => {
	return new JwtAdapter('secret');
};

describe('Jwt Adapter', () => {
	describe('sign()', () => {
		test('Should call with correct with correct values', async () => {
			const sut = makeSut();
			const signSpy = jest.spyOn(jwt, 'sign');
			await sut.encrypt('any_id');
			expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret');
		});

		test('Should return a token on sign success', async () => {
			const sut = makeSut();
			const accessToken = await sut.encrypt('any_id');
			expect(accessToken).toBe('any_token');
		});

		test('Should throw if sign throws', async () => {
			const sut = makeSut();
			jest.spyOn(jwt, 'sign').mockImplementationOnce(() => Promise.reject(new Error()));

			const promise = sut.encrypt('any_id');
			expect(promise).rejects.toThrow();
		});
	});

	describe('verify()', () => {
		test('Should call with correct with correct values', async () => {
			const sut = makeSut();
			const signSpy = jest.spyOn(jwt, 'verify');
			await sut.decrypt('any_token');
			expect(signSpy).toHaveBeenCalledWith('any_token', 'secret');
		});

		test('Should return a value on verify success', async () => {
			const sut = makeSut();
			const accessToken = await sut.decrypt('any_token');
			expect(accessToken).toBe('any_value');
		});

		test('Should throw if verify throws', async () => {
			const sut = makeSut();
			jest.spyOn(jwt, 'verify').mockImplementationOnce(() => Promise.reject(new Error()));
			const promise = sut.decrypt('any_token');
			expect(promise).rejects.toThrow();
		});
	});
});
