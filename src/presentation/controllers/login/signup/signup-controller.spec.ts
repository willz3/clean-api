import { throwError } from '@/domain/test';
import { SignUpController } from './signup-controller';
import {
	AddAccount,
	HttpRequest,
	Authentication,
	Validation
} from './signup-controller-protocols';
import { EmailInUseError, ServerError } from '@/presentation/errors';
import {
	ok,
	serverError,
	badRequest,
	forbidden
} from '@/presentation/helpers/http/http-helper';
import { mockAddAccount, mockAuthentication, mockValidation } from '@/presentation/test';

type SutTypes = {
	sut: SignUpController;
	addAccountStub: AddAccount;
	validationStub: Validation;
	authenticationStub: Authentication;
};

const makeSut = (): SutTypes => {
	const addAccountStub = mockAddAccount();
	const validationStub = mockValidation();
	const authenticationStub = mockAuthentication();
	const sut = new SignUpController(addAccountStub, validationStub, authenticationStub);

	return {
		sut,
		addAccountStub,
		validationStub,
		authenticationStub
	};
};

const mockRequest = (): HttpRequest => {
	return {
		body: {
			name: 'any_name',
			email: 'any_email@mail.com',
			password: 'any_password',
			password_confirmation: 'any_password'
		}
	};
};

describe('SignUp Controller', () => {
	test('Should call AddAccount with correct values', async () => {
		const { sut, addAccountStub } = makeSut();

		const addSpy = jest.spyOn(addAccountStub, 'add');
		await sut.handle(mockRequest());
		expect(addSpy).toHaveBeenCalledWith({
			name: 'any_name',
			email: 'any_email@mail.com',
			password: 'any_password'
		});
	});

	test('Should return 500 if AddAccount throws', async () => {
		const { sut, addAccountStub } = makeSut();
		const error = new Error();
		jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
			return new Promise((resolve, reject) => {
				reject(error);
			});
		});
		const httpResponse = await sut.handle(mockRequest());
		expect(httpResponse).toEqual(serverError(new ServerError(error.stack)));
	});

	test('Should return 200 if valid data is provided', async () => {
		const { sut } = makeSut();
		const httpResponse = await sut.handle(mockRequest());
		expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }));
	});

	it('Should call Validation with correct values', async () => {
		const { sut, validationStub } = makeSut();

		const validateSpy = jest.spyOn(validationStub, 'validate');
		const httpRequest = mockRequest();
		await sut.handle(httpRequest);
		expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
	});

	it('Should return 400 if Validation returns an error', async () => {
		const { sut, validationStub } = makeSut();

		jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error());

		const httpResponse = await sut.handle(mockRequest());
		expect(httpResponse).toEqual(badRequest(new Error()));
	});

	it('Should call Authentication with correct values', async () => {
		const { sut, authenticationStub } = makeSut();

		const authSpy = jest.spyOn(authenticationStub, 'auth');

		await sut.handle(mockRequest());
		expect(authSpy).toHaveBeenCalledWith({
			email: 'any_email@mail.com',
			password: 'any_password'
		});
	});

	it('Should return 500 if Authentication throws', async () => {
		const { sut, authenticationStub } = makeSut();

		jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(throwError);

		const httpResponse = await sut.handle(mockRequest());
		expect(httpResponse).toEqual(serverError(new Error()));
	});

	it('Should return 403 if AddCount returns null', async () => {
		const { sut, addAccountStub } = makeSut();

		jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(Promise.resolve(null));

		const httpResponse = await sut.handle(mockRequest());
		expect(httpResponse).toEqual(forbidden(new EmailInUseError()));
	});
});
