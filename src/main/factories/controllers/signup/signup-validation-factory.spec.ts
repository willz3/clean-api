import { Validation } from '../../../../presentation/protocols/validation';
import { EmailValidator } from '../../../../validation/protocols/email-validator';
import {
	RequiredFieldValidation,
	CompareFieldsValidation,
	EmailValidation,
	ValidationComposite
} from '../../../../validation/validators';
import { makeSignUpValidation } from './signup-validation-factory';

jest.mock('../../../../validation/validators/validation-composite');

const makeEmailValidator = (): EmailValidator => {
	class EmailValidatorStub implements EmailValidator {
		isValid(email: string): boolean {
			return true;
		}
	}

	return new EmailValidatorStub();
};

describe('SignUpValidationFactory', () => {
	it('Should call ValidationComposite with all validations', () => {
		makeSignUpValidation();
		const validations: Validation[] = [];
		for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
			validations.push(new RequiredFieldValidation(field));
		}
		validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'));
		validations.push(new EmailValidation('email', makeEmailValidator()));
		expect(ValidationComposite).toHaveBeenCalledWith(validations);
	});
});
