import { SignUpController } from './signup-controller';
import {
	AddAccount,
	AddAccountModel,
	AccountModel,
	HttpRequest,
	Authentication,
	AuthenticationModel
} from './signup-controller-protocols';
import { ServerError } from '../../errors';
import { ok, serverError, badRequest } from '../../helpers/http/http-helper';
import { Validation } from '../../protocols/validation';

interface SutType {
	sut: SignUpController;
	addAccountStub: AddAccount;
	validationStub: Validation;
	authenticationStub: Authentication;
}

const makeValidation = (): Validation => {
	class ValidationStub implements Validation {
		validate(input: any): Error {
			return null;
		}
	}

	return new ValidationStub();
};

const makeAuthentication = (): Authentication => {
	class AuthenticationStub implements Authentication {
		async auth(authentication: AuthenticationModel): Promise<string> {
			return Promise.resolve('any_token');
		}
	}

	return new AuthenticationStub();
};

const makeFakeAccount = (): AccountModel => {
	return {
		id: 'valid_id',
		name: 'valid_name',
		email: 'valid_email@mail.com',
		password: 'valid_password'
	};
};

const makeAddAccount = (): AddAccount => {
	class AddAccountStub implements AddAccount {
		async add(account: AddAccountModel): Promise<AccountModel> {
			return new Promise((resolve) => resolve(makeFakeAccount()));
		}
	}

	return new AddAccountStub();
};

const makeSut = (): SutType => {
	const addAccountStub = makeAddAccount();
	const validationStub = makeValidation();
	const authenticationStub = makeAuthentication();
	const sut = new SignUpController(addAccountStub, validationStub, authenticationStub);

	return {
		sut,
		addAccountStub,
		validationStub,
		authenticationStub
	};
};

const makeFakeRequest = (): HttpRequest => {
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
		await sut.handle(makeFakeRequest());
		expect(addSpy).toHaveBeenCalledWith({
			name: 'any_name',
			email: 'any_email@mail.com',
			password: 'any_password'
		});
	});

	test('Should return 500 if AddAccount throws', async () => {
		const { sut, addAccountStub } = makeSut();

		jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
			return new Promise((resolve, reject) => {
				reject(new Error());
			});
		});
		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(serverError(new ServerError(null)));
	});

	test('Should return 200 if valid data is provided', async () => {
		const { sut } = makeSut();
		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(ok(makeFakeAccount()));
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

	it('Should call Authentication with correct values', async () => {
		const { sut, authenticationStub } = makeSut();

		const authSpy = jest.spyOn(authenticationStub, 'auth');

		await sut.handle(makeFakeRequest());
		expect(authSpy).toHaveBeenCalledWith({
			email: 'any_email@mail.com',
			password: 'any_password'
		});
	});
});
