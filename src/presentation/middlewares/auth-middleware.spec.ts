import { ok, forbidden, serverError } from '@/presentation/helpers/http/http-helper';
import { AccessDeniedError } from '@/presentation/errors';
import { AuthMiddleware } from './auth-middleware';
import { HttpRequest, LoadAccountByToken } from './auth-middleware-protocols';
import { throwError } from '@/domain/test';
import { mockLoadAccountByToken } from '@/presentation/test';

describe('Auth middleware', () => {
	it('Should return 403 if no x-access-token exists in headers', async () => {
		const { sut } = makeSut();
		const httpResponse = await sut.handle({});

		expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
	});

	it('Should call LoadAccountByToken with correct accessToken', async () => {
		const role = 'any_role';
		const { sut, loadAccountByTokenStub } = makeSut(role);
		const loadSpy = jest.spyOn(loadAccountByTokenStub, 'loadByToken');

		await sut.handle(makeFakeRequest());

		expect(loadSpy).toHaveBeenCalledWith('any_token', role);
	});

	it('Should return 403 if no x-access-token returns null', async () => {
		const { sut, loadAccountByTokenStub } = makeSut();
		jest
			.spyOn(loadAccountByTokenStub, 'loadByToken')
			.mockReturnValueOnce(Promise.resolve(null));
		const httpResponse = await sut.handle(makeFakeRequest());

		expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
	});

	it('Should return 200 on success', async () => {
		const { sut } = makeSut();
		const httpResponse = await sut.handle(makeFakeRequest());

		expect(httpResponse).toEqual(ok({ accountId: 'any_id' }));
	});

	it('Should return server error if loadAccountByToken throws', async () => {
		const { sut, loadAccountByTokenStub } = makeSut();
		jest.spyOn(loadAccountByTokenStub, 'loadByToken').mockImplementationOnce(throwError);
		const httpResponse = await sut.handle(makeFakeRequest());

		expect(httpResponse).toEqual(serverError(new Error()));
	});
});

type SutTypes = {
	sut: AuthMiddleware;
	loadAccountByTokenStub: LoadAccountByToken;
};

const makeSut = (role?: string): SutTypes => {
	const loadAccountByTokenStub = mockLoadAccountByToken();
	const sut = new AuthMiddleware(loadAccountByTokenStub, role);
	return {
		sut,
		loadAccountByTokenStub
	};
};

const makeFakeRequest = (): HttpRequest => {
	return {
		headers: {
			'x-access-token': 'any_token'
		}
	};
};
