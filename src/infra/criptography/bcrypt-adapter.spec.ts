import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";

jest.mock("bcrypt", () => ({
	async hash(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			resolve("hash");
		});
	},

	async compare(): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			resolve(true);
		});
	},
}));
const salt = 12;

const makeSut = (): BcryptAdapter => {
	return new BcryptAdapter(salt);
};

describe("BCrypt Adapter", () => {
	test("Should call hash with correct values", async () => {
		const sut = makeSut();
		const hashSpy = jest.spyOn(bcrypt, "hash");
		await sut.hash("any_value");
		expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
	});

	test("Should return a valid hash on hash success", async () => {
		const sut = makeSut();
		const hash = await sut.hash("any_value");

		expect(hash).toBe("hash");
	});

	test("Should call compare with correct values", async () => {
		const sut = makeSut();
		const hashSpy = jest.spyOn(bcrypt, "compare");
		await sut.compare("any_value", "any_hash");
		expect(hashSpy).toHaveBeenCalledWith("any_value", "any_hash");
	});
});
