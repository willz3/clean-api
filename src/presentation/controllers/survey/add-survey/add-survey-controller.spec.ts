import { HttpRequest, Validation, AddSurvey } from './add-survey-controller-protocols';
import { AddSurveyController } from './add-survey-controller';
import {
	badRequest,
	noContent,
	serverError
} from '@/presentation/helpers/http/http-helper';
import MockDate from 'mockdate';
import { throwError } from '@/domain/test';
import { mockAddSurvey, mockValidation } from '@/presentation/test';

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

		const httpRequest = mockRequest();

		await sut.handle(httpRequest);

		expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
	});

	it('Should return 400 if validation fails', async () => {
		const { sut, validationStub } = makeSut();
		jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error());

		const httpRequest = mockRequest();

		const httpResponse = await sut.handle(httpRequest);

		expect(httpResponse).toEqual(badRequest(new Error()));
	});

	it('Should call AddSurvey with correct values', async () => {
		const { sut, addSurveyStub } = makeSut();
		const addSpy = jest.spyOn(addSurveyStub, 'add');

		const httpRequest = mockRequest();

		await sut.handle(httpRequest);

		expect(addSpy).toHaveBeenCalledWith(httpRequest.body);
	});

	it('Should return server error if AddSurvey throws', async () => {
		const { sut, addSurveyStub } = makeSut();
		jest.spyOn(addSurveyStub, 'add').mockImplementationOnce(throwError);

		const result = await sut.handle(mockRequest());

		expect(result).toEqual(serverError(new Error()));
	});

	it('Should return 204 on success', async () => {
		const { sut } = makeSut();

		const result = await sut.handle(mockRequest());

		expect(result).toEqual(noContent());
	});
});

type SutTypes = {
	sut: AddSurveyController;
	validationStub: Validation;
	addSurveyStub: AddSurvey;
};

const makeSut = (): SutTypes => {
	const validationStub = mockValidation();
	const addSurveyStub = mockAddSurvey();
	const sut = new AddSurveyController(validationStub, addSurveyStub);
	return {
		sut,
		validationStub,
		addSurveyStub
	};
};

const mockRequest = (): HttpRequest => ({
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
