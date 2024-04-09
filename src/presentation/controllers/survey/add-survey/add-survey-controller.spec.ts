import {
	HttpRequest,
	Validation,
	AddSurvey,
	AddSurveyParams
} from './add-survey-controller-protocols';
import { AddSurveyController } from './add-survey-controller';
import {
	badRequest,
	noContent,
	serverError
} from '@/presentation/helpers/http/http-helper';
import MockDate from 'mockdate';
import { throwError } from '@/domain/test';

describe('AddSurvey Controller', () => {
	beforeAll(() => {
		MockDate.set(new Date());
	});

	afterAll(() => {
		MockDate.reset();
	});

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
		jest.spyOn(addSurveyStub, 'add').mockImplementationOnce(throwError);

		const result = await sut.handle(makeFakeRequest());

		expect(result).toEqual(serverError(new Error()));
	});

	it('Should return 204 on success', async () => {
		const { sut } = makeSut();

		const result = await sut.handle(makeFakeRequest());

		expect(result).toEqual(noContent());
	});
});

type SutTypes = {
	sut: AddSurveyController;
	validationStub: Validation;
	addSurveyStub: AddSurvey;
};

const makeAddSurveyStub = (): AddSurvey => {
	class AddSurveyStub implements AddSurvey {
		async add(input: AddSurveyParams): Promise<void> {
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
		],
		date: new Date()
	}
});
