import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware';
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper';
import { AccessDeniedError } from '@/presentation/errors';
import { LoadAccountByTokenSpy } from '@/tests/presentation/mock';
import { throwError } from '@/tests/domain/mock';

const mockRequest = (): AuthMiddleware.Request => ({
	accessToken: 'any_token'
});

type SutTypes = {
	sut: AuthMiddleware;
	loadAccountByTokenSpy: LoadAccountByTokenSpy;
};

const makeSut = (role?: string): SutTypes => {
	const loadAccountByTokenSpy = new LoadAccountByTokenSpy();
	const sut = new AuthMiddleware(loadAccountByTokenSpy, role);
	return {
		sut,
		loadAccountByTokenSpy
	};
};

describe('Auth Middleware', () => {
	test('Should return 403 if no x-access-token exists in headers', async () => {
		const { sut } = makeSut();
		const httpResponse = await sut.handle({});
		expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
	});

	test('Should call LoadAccountByToken with correct accessToken', async () => {
		const role = 'any_role';
		const { sut, loadAccountByTokenSpy } = makeSut(role);
		const request = mockRequest();
		await sut.handle(request);
		expect(loadAccountByTokenSpy.accessToken).toBe(request.accessToken);
		expect(loadAccountByTokenSpy.role).toBe(role);
	});

	test('Should return 403 if LoadAccountByToken returns null', async () => {
		const { sut, loadAccountByTokenSpy } = makeSut();
		loadAccountByTokenSpy.result = null;
		const httpResponse = await sut.handle(mockRequest());
		expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
	});

	test('Should return 200 if LoadAccountByToken returns an account', async () => {
		const { sut, loadAccountByTokenSpy } = makeSut();
		const httpResponse = await sut.handle(mockRequest());
		expect(httpResponse).toEqual(
			ok({
				accountId: loadAccountByTokenSpy.result.id
			})
		);
	});

	test('Should return 500 if LoadAccountByToken throws', async () => {
		const { sut, loadAccountByTokenSpy } = makeSut();
		jest.spyOn(loadAccountByTokenSpy, 'load').mockImplementationOnce(throwError);
		const httpResponse = await sut.handle(mockRequest());
		expect(httpResponse).toEqual(serverError(new Error()));
	});
});
