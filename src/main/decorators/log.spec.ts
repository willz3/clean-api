import {
	Controller,
	HttpRequest,
	HttpResponse,
} from "../../presentation/protocols";
import { LogControllerDecorator } from "./log";
import { serverError } from "../../presentation/helpers/http-helper";
import { LogErrorRepository } from "../../data/protocols/log-error-repository";

interface SutTypes {
	sut: LogControllerDecorator;
	controllerStub: Controller;
	logErrorRepositoryStub: LogErrorRepository;
}

const makeLogErrorRepository = (): LogErrorRepository => {
	class LogErrorRepositoryStub implements LogErrorRepository {
		async log(stack: string): Promise<void> {
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
			const httpResponse: HttpResponse = {
				statusCode: 200,
				body: {
					name: "any",
				},
			};
			return new Promise((resolve) => resolve(httpResponse));
		}
	}
	return new ControllerStub();
};

const makeSut = (): SutTypes => {
	const controllerStub = makeControllerStub();
	const logErrorRepositoryStub = makeLogErrorRepository();
	const sut = new LogControllerDecorator(
		controllerStub,
		logErrorRepositoryStub
	);

	return {
		sut,
		controllerStub,
		logErrorRepositoryStub,
	};
};

describe("LogController Decorator", () => {
	test("Should call controller handle method", async () => {
		const { sut, controllerStub } = makeSut();
		const handleSpy = jest.spyOn(controllerStub, "handle");

		const httpRequest = {
			body: {
				email: "any_mail@mail.com",
				name: "any_name",
				password: "any_password",
				password_confirmation: "any_password",
			},
		};
		await sut.handle(httpRequest);
		expect(handleSpy).toHaveBeenCalledWith(httpRequest);
	});

	test("Should return the same result of the controller", async () => {
		const { sut } = makeSut();

		const httpRequest = {
			body: {
				email: "any_mail@mail.com",
				name: "any_name",
				password: "any_password",
				password_confirmation: "any_password",
			},
		};
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse).toEqual({
			statusCode: 200,
			body: {
				name: "any",
			},
		});
	});

	test("Should call LogErrorRepository with correct error if controller returns a server error", async () => {
		const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
		const fakeError = new Error();
		fakeError.stack = "any_stack";
		const error = serverError(fakeError);

		const logSpy = jest.spyOn(logErrorRepositoryStub, "log");

		jest.spyOn(controllerStub, "handle").mockReturnValueOnce(
			new Promise((resolve, reject) => {
				resolve(error);
			})
		);

		const httpRequest = {
			body: {
				email: "any_mail@mail.com",
				name: "any_name",
				password: "any_password",
				password_confirmation: "any_password",
			},
		};
		await sut.handle(httpRequest);
		expect(logSpy).toHaveBeenCalledWith("any_stack");
	});
});
