import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';
import { LogControllerDecorator } from './log-controller-decorator';
import { ok, serverError } from '@/presentation/helpers/http/http-helper';
import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository';
import { AccountModel } from '@/domain/model/account';

type SutTypes = {
	sut: LogControllerDecorator;
	controllerStub: Controller;
	logErrorRepositoryStub: LogErrorRepository;
}

const makeLogErrorRepository = (): LogErrorRepository => {
	class LogErrorRepositoryStub implements LogErrorRepository {
		async logError(stack: string): Promise<void> {
			return new Promise<void>((resolve, reject) => {
				resolve();
			});
		}
	}

	return new LogErrorRepositoryStub();
};

const makeControllerStub = (): Controller => {
	class ControllerStub implements Controller {
		handle(httpRquest: HttpRequest): Promise<HttpResponse> {
			return new Promise((resolve) => resolve(ok(makeFakeAccount())));
		}
	}
	return new ControllerStub();
};

const makeFakeAccount = (): AccountModel => {
	return {
		id: 'valid_id',
		name: 'valid_name',
		email: 'valid_email@mail.com',
		password: 'valid_password'
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

const makeFakeServerError = (): HttpResponse => {
	const fakeError = new Error();
	fakeError.stack = 'any_stack';
	return serverError(fakeError);
};

const makeSut = (): SutTypes => {
	const controllerStub = makeControllerStub();
	const logErrorRepositoryStub = makeLogErrorRepository();
	const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub);

	return {
		sut,
		controllerStub,
		logErrorRepositoryStub
	};
};

describe('LogController Decorator', () => {
	test('Should call controller handle method with the same values that was sent to decorator', async () => {
		const { sut, controllerStub } = makeSut();
		const handleSpy = jest.spyOn(controllerStub, 'handle');

		const httpRequest = makeFakeRequest();
		await sut.handle(httpRequest);
		expect(handleSpy).toHaveBeenCalledWith(httpRequest);
	});

	test('Should return the same result of the controller', async () => {
		const { sut } = makeSut();
		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(ok(makeFakeAccount()));
	});

	test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
		const { sut, controllerStub, logErrorRepositoryStub } = makeSut();

		const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError');

		jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(
			new Promise((resolve, reject) => {
				resolve(makeFakeServerError());
			})
		);
		await sut.handle(makeFakeRequest());
		expect(logSpy).toHaveBeenCalledWith('any_stack');
	});
});
