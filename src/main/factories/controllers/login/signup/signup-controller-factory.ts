import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { makeDbAddAccount } from '@/main/factories/usecases/account/db-add-account-factory';
import { makeDbAuthentication } from '@/main/factories/usecases/account/db-authentication-factory';
import { SignUpController } from '@/presentation/controllers/login/signup/signup-controller';
import { Controller } from '@/presentation/protocols';
import { makeSignUpValidation } from './signup-validation-factory';

export const makeSignUpController = (): Controller => {
	const signupController = new SignUpController(
		makeDbAddAccount(),
		makeSignUpValidation(),
		makeDbAuthentication()
	);

	return makeLogControllerDecorator(signupController);
};
