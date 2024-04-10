import { Validation } from '@/presentation/protocols/validation';

const mockValidation = (): Validation => {
	class ValidateStub implements Validation {
		validate(input: any): Error | null {
			return null;
		}
	}
	return new ValidateStub();
};

export { mockValidation };
