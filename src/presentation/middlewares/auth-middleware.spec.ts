import { ok, forbidden, serverError } from '../helpers/http/http-helper';
import { AccessDeniedError } from '../errors';
import { AuthMiddleware } from './auth-middleware';
import {
	HttpRequest,
	LoadAccountByToken,
	AccountModel
} from './auth-middleware-protocols';

describe('Auth middleware', () => {
	it('Should return 403 if no x-access-token exists in headers', async () => {
		const { sut } = makeSut();
		const httpResponse = await sut.handle({});

		expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
	});

	it('Should call LoadAccountByToken with correct accessToken', async () => {
		const role = 'any_role';
		const { sut, loadAccountByTokenStub } = makeSut(role);
		const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load');

		await sut.handle(makeFakeRequest());

		expect(loadSpy).toHaveBeenCalledWith('any_token', role);
	});

	it('Should return 403 if no x-access-token returns null', async () => {
		const { sut, loadAccountByTokenStub } = makeSut();
		jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(Promise.resolve(null));
		const httpResponse = await sut.handle(makeFakeRequest());

		expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
	});

	it('Should return 200 on success', async () => {
		const { sut } = makeSut();
		const httpResponse = await sut.handle(makeFakeRequest());

		expect(httpResponse).toEqual(ok({ accountId: 'valid_id' }));
	});

	it('Should return server error if loadAccountByToken throws', async () => {
		const { sut, loadAccountByTokenStub } = makeSut();
		jest
			.spyOn(loadAccountByTokenStub, 'load')
			.mockReturnValueOnce(Promise.reject(new Error()));
		const httpResponse = await sut.handle(makeFakeRequest());

		expect(httpResponse).toEqual(serverError(new Error()));
	});
});

type SutTypes = {
	sut: AuthMiddleware;
	loadAccountByTokenStub: LoadAccountByToken;
};

const makeSut = (role?: string): SutTypes => {
	const loadAccountByTokenStub = makeLoadAccountByTokenStub();
	const sut = new AuthMiddleware(loadAccountByTokenStub, role);
	return {
		sut,
		loadAccountByTokenStub
	};
};

const makeLoadAccountByTokenStub = (): LoadAccountByToken => {
	class LoadAccountByTokenStub implements LoadAccountByToken {
		load(accessToken: string, role?: string): Promise<AccountModel | null> {
			return Promise.resolve(makeFakeAccount());
		}
	}
	return new LoadAccountByTokenStub();
};

const makeFakeAccount = (): AccountModel => {
	return {
		id: 'valid_id',
		name: 'valid_name',
		email: 'valid_email@mail.com',
		password: 'hashed_password'
	};
};

const makeFakeRequest = (): HttpRequest => {
	return {
		headers: {
			'x-access-token': 'any_token'
		}
	};
};
