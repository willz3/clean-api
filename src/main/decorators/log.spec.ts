import {
	Controller,
	HttpRequest,
	HttpResponse,
} from "../../presentation/protocols";
import { LogControllerDecorator } from "./log";

describe("LogController Decorator", () => {
	test("Should call controller handle method", async () => {
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

		const controllerStub = new ControllerStub();

		const handleSpy = jest.spyOn(controllerStub, "handle");

		const sut = new LogControllerDecorator(controllerStub);
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
