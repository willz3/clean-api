import request from "supertest";
import app from "../config/app";

describe("Signup routes", () => {
	test("Should return an account on success", async () => {
		await request(app)
			.post("/api/signup")
			.send({
				name: "valid_name",
				email: "valid_mail@mail.com",
				password: "valid_password",
				passwordConfirmation: "valid_password",
			})
			.expect(200);
	});
});
