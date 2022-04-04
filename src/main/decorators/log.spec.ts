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
	test("Should call controller handle method with the same values that was sent to decorator", async () => {
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
});
