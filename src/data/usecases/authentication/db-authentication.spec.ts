import { AccountModel } from "../../../domain/model/account";
import { AuthenticationModel } from "../../../domain/usecases/authentication";
import { LoadAccountByEmailRepository } from "../../protocols/load-account-by-email-repository";
import { DbAuthentication } from "./db-authentication";

const makeFakeAccount = (): AccountModel => {
	return {
		id: "any_id",
		name: "any_name",
		email: "any_email",
		password: "any_password",
	};
};

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
	class LoadAccountByEmailRepositoryStub
		implements LoadAccountByEmailRepository
	{
		async load(email: string): Promise<AccountModel> {
			return Promise.resolve(makeFakeAccount());
		}
	}

	return new LoadAccountByEmailRepositoryStub();
};

const makeFakeAuthentication = (): AuthenticationModel => {
	return {
		email: "any_email@mail.com",
		password: "any_password",
	};
};

const makeSut = (): SutTypes => {
	const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
	const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);

	return { sut, loadAccountByEmailRepositoryStub };
};

interface SutTypes {
	sut: DbAuthentication;
	loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
}

describe("DbAuthentication UseCase", () => {
	it("Should call LoadAccountByEmailRepository with correct email", async () => {
		const { sut, loadAccountByEmailRepositoryStub } = makeSut();
		const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "load");
		await sut.auth(makeFakeAuthentication());

		expect(loadSpy).toHaveBeenCalledWith("any_email@mail.com");
	});
});