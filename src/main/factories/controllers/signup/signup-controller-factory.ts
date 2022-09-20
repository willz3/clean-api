import { SignUpController } from '../../../../presentation/controllers/signup/signup-controller';
import { Controller } from '../../../../presentation/protocols';
import { makeSignUpValidation } from './signup-validation-factory';
import { makeDbAuthentication } from '../../usecases/db-authentication-factory';
import { makeDbAddAccount } from '../../usecases/db-add-account-factory';
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory';

export const makeSignUpController = (): Controller => {
	const signupController = new SignUpController(
		makeDbAddAccount(),
		makeSignUpValidation(),
		makeDbAuthentication()
	);

	return makeLogControllerDecorator(signupController);
};
