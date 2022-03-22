import {
	Controller,
	HttpRequest,
	HttpResponse,
} from "../../presentation/protocols";
import { LogControllerDecorator } from "./log";

interface SutTypes {
	sut: LogControllerDecorator;
	controllerStub: Controller;
}

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
	const sut = new LogControllerDecorator(controllerStub);

	return {
		sut,
		controllerStub,
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
		const { sut, controllerStub } = makeSut();

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
});
