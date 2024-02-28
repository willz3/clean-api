import { HttpRequest, Validation } from './add-survey-controller-protocols';
import { AddSurveyController } from './add-survey-controller';

describe('AddSurvey Controller', () => {
	it('Should call validation with correct values', async () => {
		const { sut, validationStub } = makeSut();
		const validateSpy = jest.spyOn(validationStub, 'validate');

		const httpRequest = makeFakeRequest();

		await sut.handle(httpRequest);

		expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
	});
});

type SutTypes = {
	sut: AddSurveyController;
	validationStub: Validation;
};

const makeValidationStub = (): Validation => {
	class ValidationStub implements Validation {
		validate(input: any): Error | null {
			return null;
		}
	}
	return new ValidationStub();
};

const makeSut = (): SutTypes => {
	const validationStub = makeValidationStub();
	const sut = new AddSurveyController(validationStub);
	return {
		sut,
		validationStub
	};
};

const makeFakeRequest = (): HttpRequest => ({
	body: {
		question: 'any_question',
		answers: [
			{
				image: 'any_image',
				answer: 'any_answer'
			}
		]
	}
});
