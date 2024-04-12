import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';
import { LogControllerDecorator } from './log-controller-decorator';
import { ok, serverError } from '@/presentation/helpers/http/http-helper';
import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository';
import { mockAccountModel } from '@/domain/test';
import { mockLogErrorRepository } from '@/data/test';

type SutTypes = {
	sut: LogControllerDecorator;
	controllerStub: Controller;
	logErrorRepositoryStub: LogErrorRepository;
};

const makeControllerStub = (): Controller => {
	class ControllerStub implements Controller {
		handle(httpRquest: HttpRequest): Promise<HttpResponse> {
			return new Promise((resolve) => resolve(ok(mockAccountModel())));
		}
	}
	return new ControllerStub();
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

const makeFakeServerError = (): HttpResponse => {
	const fakeError = new Error();
	fakeError.stack = 'any_stack';
	return serverError(fakeError);
};

const makeSut = (): SutTypes => {
	const controllerStub = makeControllerStub();
	const logErrorRepositoryStub = mockLogErrorRepository();
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

		const httpRequest = mockRequest();
		await sut.handle(httpRequest);
		expect(handleSpy).toHaveBeenCalledWith(httpRequest);
	});

	test('Should return the same result of the controller', async () => {
		const { sut } = makeSut();
		const httpResponse = await sut.handle(mockRequest());
		expect(httpResponse).toEqual(ok(mockAccountModel()));
	});

	test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
		const { sut, controllerStub, logErrorRepositoryStub } = makeSut();

		const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError');

		jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(
			new Promise((resolve, reject) => {
				resolve(makeFakeServerError());
			})
		);
		await sut.handle(mockRequest());
		expect(logSpy).toHaveBeenCalledWith('any_stack');
	});
});
