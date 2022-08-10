import { LogControllerDecorator } from "../../decorators/log-controller-decorator";
import { makeLoginValidation } from "./login-validation-factory";
import { Controller } from "../../../presentation/protocols";
import { DbAuthentication } from "../../../data/usecases/authentication/db-authentication";
import { LoginController } from "../../../presentation/controllers/login/login-controller";
import { LogMongoRepository } from "../../../infra/db/mongodb/log/log-mongo-repository";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account/account-mongo-repository";
import { BcryptAdapter } from "../../../infra/criptography/bcrypt-adapter/bcrypt-adapter";
import { JwtAdapter } from "../../../infra/criptography/jwt-adapter/jwt-adapter";
import env from "../../config/env";

export const makeSignUpController = (): Controller => {
	const salt = 12;
	const bcrypAdapter = new BcryptAdapter(salt);
	const jwtAdapter = new JwtAdapter(env.jwtSecret);
	const accountMongoRepository = new AccountMongoRepository();
	const dbAuthentication = new DbAuthentication(
		accountMongoRepository,
		accountMongoRepository,
		bcrypAdapter,
		jwtAdapter
	);
	const loginController = new LoginController(
		dbAuthentication,
		makeLoginValidation()
	);
	const logMongoRepository = new LogMongoRepository();
	return new LogControllerDecorator(loginController, logMongoRepository);
};
