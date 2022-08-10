import request from "supertest";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import app from "../config/app";
import { hash } from "bcrypt";
import { Collection } from "mongodb";

let accountCollection: Collection;
describe("Login routes", () => {
	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL);
		accountCollection = await MongoHelper.getCollection("accounts");
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});

	beforeEach(() => async () => {
		await accountCollection.deleteMany({});
	});

	describe("POST /signup", () => {
		test("Should return 200 on signup", async () => {
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

	describe("POST /login", () => {
		test("Should return 200 on login", async () => {
			const hashPassword = await hash("valid_password", 12);

			await accountCollection.insertOne({
				name: "valid_name",
				email: "valid_mail@mail.com",
				password: hashPassword,
			});

			await request(app)
				.post("/api/login")
				.send({
					email: "valid_mail@mail.com",
					password: "valid_password",
				})
				.expect(200);
		});
	});
});
