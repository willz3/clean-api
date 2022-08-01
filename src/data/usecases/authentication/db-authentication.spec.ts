import { AccountModel } from "../../../domain/model/account";
import { AuthenticationModel } from "../../../domain/usecases/authentication";
import { HashComparer } from "../../protocols/criptography/hash-comparer";
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository";
import { DbAuthentication } from "./db-authentication";

const makeFakeAccount = (): AccountModel => {
	return {
		id: "any_id",
		name: "any_name",
		email: "any_email",
		password: "hashed_password",
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

const makeHashComparer = (): HashComparer => {
	class HashComparerStub implements HashComparer {
		async compare(value: string, hash: string): Promise<boolean> {
			return Promise.resolve(true);
		}
	}

	return new HashComparerStub();
};

const makeFakeAuthentication = (): AuthenticationModel => {
	return {
		email: "any_email@mail.com",
		password: "any_password",
	};
};

const makeSut = (): SutTypes => {
	const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
	const hashComparerStub = makeHashComparer();
	const sut = new DbAuthentication(
		loadAccountByEmailRepositoryStub,
		hashComparerStub
	);

	return { sut, loadAccountByEmailRepositoryStub, hashComparerStub };
};

interface SutTypes {
	sut: DbAuthentication;
	loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
	hashComparerStub: HashComparer;
}

describe("DbAuthentication UseCase", () => {
	it("Should call LoadAccountByEmailRepository with correct email", async () => {
		const { sut, loadAccountByEmailRepositoryStub } = makeSut();
		const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "load");
		await sut.auth(makeFakeAuthentication());

		expect(loadSpy).toHaveBeenCalledWith("any_email@mail.com");
	});

	it("Should throw if LoadAccountByEmailRepository throws", async () => {
		const { sut, loadAccountByEmailRepositoryStub } = makeSut();
		jest
			.spyOn(loadAccountByEmailRepositoryStub, "load")
			.mockReturnValueOnce(Promise.reject(new Error()));

		const promise = sut.auth(makeFakeAuthentication());

		await expect(promise).rejects.toThrowError();
	});

	it("Should return null if LoadAccountByEmailRepository returns null", async () => {
		const { sut, loadAccountByEmailRepositoryStub } = makeSut();

		jest
			.spyOn(loadAccountByEmailRepositoryStub, "load")
			.mockReturnValueOnce(null);

		const accessToken = await sut.auth(makeFakeAuthentication());

		expect(accessToken).toBeNull();
	});

	it("Should call HashComparer with correct password", async () => {
		const { sut, hashComparerStub } = makeSut();
		const compareSpy = jest.spyOn(hashComparerStub, "compare");
		await sut.auth(makeFakeAuthentication());

		expect(compareSpy).toHaveBeenCalledWith("any_password", "hashed_password");
	});

	it("Should throw if HashComparer throws", async () => {
		const { sut, hashComparerStub } = makeSut();
		jest
			.spyOn(hashComparerStub, "compare")
			.mockReturnValueOnce(Promise.reject(new Error()));

		const promise = sut.auth(makeFakeAuthentication());

		await expect(promise).rejects.toThrowError();
	});
});
