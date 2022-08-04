import jwt from "jsonwebtoken";
import { JwtAdapter } from "./jwt-adapter";

jest.mock("jsonwebtoken", () => ({
	async sign(): Promise<string> {
		return Promise.resolve("any_token");
	},
}));
describe("Jwt Adapter", () => {
	test("Should call with correct with correct values", async () => {
		const sut = new JwtAdapter("secret");
		const signSpy = jest.spyOn(jwt, "sign");
		await sut.encrypt("any_id");
		expect(signSpy).toHaveBeenCalledWith({ id: "any_id" }, "secret");
	});

	test("Should return a token on sign success", async () => {
		const sut = new JwtAdapter("secret");
		const accessToken = await sut.encrypt("any_id");
		expect(accessToken).toBe("any_token");
	});

	test("Should throw if sign throws", async () => {
		const sut = new JwtAdapter("secret");
		jest
			.spyOn(jwt, "sign")
			.mockImplementationOnce(() => Promise.reject(new Error()));

		const promise = sut.encrypt("any_id");
		expect(promise).rejects.toThrowError();
	});
});
