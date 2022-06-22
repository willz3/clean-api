import { MissingParamError } from "../../errors";
import { Validation } from "./validation";
import { ValidationComposite } from "./validation-composite";

interface SutTypes {
	sut: ValidationComposite;
	validationStubs: Validation[];
}

const makeValidationStub = (): Validation => {
	class ValidateStub implements Validation {
		validate(input: any): Error {
			return null;
		}
	}
	return new ValidateStub();
};

const makeSut = (): SutTypes => {
	const validationStubs = [makeValidationStub(), makeValidationStub()];
	const sut = new ValidationComposite(validationStubs);
	return {
		sut,
		validationStubs,
	};
};

describe("ValidationComposite", () => {
	it("Should return an Error if any validation fails", () => {
		const { sut, validationStubs } = makeSut();
		
		jest
			.spyOn(validationStubs[1], "validate")
			.mockReturnValueOnce(new MissingParamError("field"));
		
		const error = sut.validate({ field: "any_value" });
		expect(error).toEqual(new MissingParamError("field"));
	});
});
