import {
	badRequest,
	ok,
	serverError,
	unauthorized
} from '@/presentation/helpers/http/http-helper';
import {
	HttpRequest,
	Authentication,
	AuthenticationModel,
	Validation
} from './login-controller-protocols';
import { LoginController } from './login-controller';

const makeAuthentication = (): Authentication => {
	class AuthenticationStub implements Authentication {
		async auth(authentication: AuthenticationModel): Promise<string> {
			return Promise.resolve('any_token');
		}
	}

	return new AuthenticationStub();
};

const makeValidation = (): Validation => {
	class ValidationStub implements Validation {
		validate(input: any): Error | null {
			return null;
		}
	}

	return new ValidationStub();
};

const makeFakeRequest = (): HttpRequest => {
	return {
		body: {
			email: 'any_email@mail.com',
			password: 'any_password'
		}
	};
};

type SutTypes = {
	sut: LoginController;
	authenticationStub: Authentication;
	validationStub: Validation;
};

const makeSut = (): SutTypes => {
	const authenticationStub = makeAuthentication();
	const validationStub = makeValidation();

	const sut = new LoginController(authenticationStub, validationStub);

	return { sut, authenticationStub, validationStub };
};

describe('Login Controller', () => {
	it('Should call Authentication with correct values', async () => {
		const { sut, authenticationStub } = makeSut();

		const authSpy = jest.spyOn(authenticationStub, 'auth');

		await sut.handle(makeFakeRequest());
		expect(authSpy).toHaveBeenCalledWith({
			email: 'any_email@mail.com',
			password: 'any_password'
		});
	});

	it('Should return 401 if invalid credentials are provided', async () => {
		const { sut, authenticationStub } = makeSut();

		jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.resolve(null));

		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(unauthorized());
	});

	it('Should return 500 if Authentication throws', async () => {
		const { sut, authenticationStub } = makeSut();

		jest
			.spyOn(authenticationStub, 'auth')
			.mockReturnValueOnce(Promise.reject(new Error()));

		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(serverError(new Error()));
	});

	it('Should return 200 if valid credentials are provided', async () => {
		const { sut } = makeSut();

		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(
			ok({
				accessToken: 'any_token'
			})
		);
	});

	it('Should call Validation with correct values', async () => {
		const { sut, validationStub } = makeSut();

		const validateSpy = jest.spyOn(validationStub, 'validate');
		const httpRequest = makeFakeRequest();
		await sut.handle(httpRequest);
		expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
	});

	it('Should return 400 if Validation returns an error', async () => {
		const { sut, validationStub } = makeSut();

		jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error());

		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(badRequest(new Error()));
	});
});
