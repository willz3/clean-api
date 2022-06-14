import { Authentication } from "../../../domain/usecases/authentication";
import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, serverError } from "../../helpers/http-helper";
import { HttpRequest } from "../../protocols";
import { EmailValidator } from "../../protocols/email-validator";
import { LoginController } from "./login";

const makeEmailValidator = (): EmailValidator => {
	class EmailValidatorStub implements EmailValidator {
		isValid(email: string): boolean {
			return true;
		}
	}

	return new EmailValidatorStub();
};

const makeAuthentication = (): Authentication => {
	class AuthenticationStub implements Authentication {
		async auth(email: string, password: string): Promise<string> {
			return Promise.resolve("any_token");
		}
	}

	return new AuthenticationStub();
};

const makeFakeRequest = (): HttpRequest => {
	return {
		body: {
			email: "any_email@mail.com",
			password: "any_password",
		},
	};
};

interface SutTypes {
	sut: LoginController;
	emailValidatorStub: EmailValidator;
	authenticationStub: Authentication;
}

const makeSut = (): SutTypes => {
	const emailValidatorStub = makeEmailValidator();
	const authenticationStub = makeAuthentication();
	const sut = new LoginController(emailValidatorStub, authenticationStub);

	return { sut, emailValidatorStub, authenticationStub };
};

describe("Login Controller", () => {
	it("Should return 400 if no email is provided", async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				password: "any_password",
			},
		};

		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse).toEqual(badRequest(new MissingParamError("email")));
	});

	it("Should return 400 if no password is provided", async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				email: "any_email@mail.com",
			},
		};

		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse).toEqual(badRequest(new MissingParamError("password")));
	});

	it("Should return 400 if an invalid email is provided", async () => {
		const { sut, emailValidatorStub } = makeSut();

		jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);

		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(badRequest(new InvalidParamError("email")));
	});

	it("Should call EmailValidator with correct email", async () => {
		const { sut, emailValidatorStub } = makeSut();

		const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");

		await sut.handle(makeFakeRequest());
		expect(isValidSpy).toHaveBeenCalledWith("any_email@mail.com");
	});

	it("Should return 500 if EmailValidator throws", async () => {
		const { sut, emailValidatorStub } = makeSut();

		jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
			throw new Error();
		});

		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(serverError(new Error()));
	});

	it("Should call Authentication with correct values", async () => {
		const { sut, authenticationStub } = makeSut();

		const authSpy = jest.spyOn(authenticationStub, "auth");

		await sut.handle(makeFakeRequest());
		expect(authSpy).toHaveBeenCalledWith("any_email@mail.com", "any_password");
	});
});