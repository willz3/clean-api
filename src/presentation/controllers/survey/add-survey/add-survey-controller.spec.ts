import {
	HttpRequest,
	Validation,
	AddSurvey,
	AddSurveyModel
} from './add-survey-controller-protocols';
import { AddSurveyController } from './add-survey-controller';
import { badRequest, serverError } from '../../../helpers/http/http-helper';

describe('AddSurvey Controller', () => {
	it('Should call validation with correct values', async () => {
		const { sut, validationStub } = makeSut();
		const validateSpy = jest.spyOn(validationStub, 'validate');

		const httpRequest = makeFakeRequest();

		await sut.handle(httpRequest);

		expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
	});

	it('Should return 400 if validation fails', async () => {
		const { sut, validationStub } = makeSut();
		jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error());

		const httpRequest = makeFakeRequest();

		const httpResponse = await sut.handle(httpRequest);

		expect(httpResponse).toEqual(badRequest(new Error()));
	});

	it('Should call AddSurvey with correct values', async () => {
		const { sut, addSurveyStub } = makeSut();
		const addSpy = jest.spyOn(addSurveyStub, 'add');

		const httpRequest = makeFakeRequest();

		await sut.handle(httpRequest);

		expect(addSpy).toHaveBeenCalledWith(httpRequest.body);
	});

	it('Should return server error if AddSurvey throws', async () => {
		const { sut, addSurveyStub } = makeSut();
		jest.spyOn(addSurveyStub, 'add').mockReturnValueOnce(Promise.reject(new Error()));

		const result = await sut.handle(makeFakeRequest());

		expect(result).toEqual(serverError(new Error()));
	});
});

type SutTypes = {
	sut: AddSurveyController;
	validationStub: Validation;
	addSurveyStub: AddSurvey;
};

const makeAddSurveyStub = (): AddSurvey => {
	class AddSurveyStub implements AddSurvey {
		async add(input: AddSurveyModel): Promise<void> {
			return Promise.resolve();
		}
	}
	return new AddSurveyStub();
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
	const addSurveyStub = makeAddSurveyStub();
	const sut = new AddSurveyController(validationStub, addSurveyStub);
	return {
		sut,
		validationStub,
		addSurveyStub
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
