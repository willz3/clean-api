import { MissingParamError } from "../../errors";
import { Validation } from "./validation";
import { ValidationComposite } from "./validation-composite";

describe("ValidationComposite", () => {
	it("Should return an Error if any validation fails", () => {
		class ValidateStub implements Validation {
			validate(input: any): Error {
				return new MissingParamError("field");
			}
		}
		const validateStub = new ValidateStub();
		const sut = new ValidationComposite([validateStub]);
		const error = sut.validate({ field: "any_value" });
		expect(error).toEqual(new MissingParamError("field"));
	});
});
