import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator';
import { Controller, HttpResponse } from '@/presentation/protocols';
import { serverError, ok } from '@/presentation/helpers/http/http-helper';
import { LogErrorRepositorySpy } from '@/tests/data/mock';
import faker from 'faker';

class ControllerSpy implements Controller {
	httpResponse = ok(faker.random.uuid());
	httpRequest: any;

	async handle(httpRequest: any): Promise<HttpResponse> {
		this.httpRequest = httpRequest;
		return Promise.resolve(this.httpResponse);
	}
}

const mockServerError = (): HttpResponse => {
	const fakeError = new Error();
	fakeError.stack = 'any_stack';
	return serverError(fakeError);
};

type SutTypes = {
	sut: LogControllerDecorator;
	controllerSpy: ControllerSpy;
	logErrorRepositorySpy: LogErrorRepositorySpy;
};

const makeSut = (): SutTypes => {
	const controllerSpy = new ControllerSpy();
	const logErrorRepositorySpy = new LogErrorRepositorySpy();
	const sut = new LogControllerDecorator(controllerSpy, logErrorRepositorySpy);
	return {
		sut,
		controllerSpy,
		logErrorRepositorySpy
	};
};

describe('LogController Decorator', () => {
	test('Should call controller handle', async () => {
		const { sut, controllerSpy } = makeSut();
		const httpRequest = faker.lorem.sentence();
		await sut.handle(httpRequest);
		expect(controllerSpy.httpRequest).toEqual(httpRequest);
	});

	test('Should return the same result of the controller', async () => {
		const { sut, controllerSpy } = makeSut();
		const httpResponse = await sut.handle(faker.lorem.sentence());
		expect(httpResponse).toEqual(controllerSpy.httpResponse);
	});

	test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
		const { sut, controllerSpy, logErrorRepositorySpy } = makeSut();
		const serverError = mockServerError();
		controllerSpy.httpResponse = serverError;
		await sut.handle(faker.lorem.sentence());
		expect(logErrorRepositorySpy.stack).toBe(serverError.body.stack);
	});
});
