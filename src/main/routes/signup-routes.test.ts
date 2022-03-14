import request from "supertest";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import app from "../config/app";

describe("Signup routes", () => {
	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL);
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});

	beforeEach(() => async () => {
		const accountCollection = MongoHelper.getCollection("accounts");
		await accountCollection.deleteMany({});
	});

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
