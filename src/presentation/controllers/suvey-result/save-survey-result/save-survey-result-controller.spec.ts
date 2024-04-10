import { mockSurveyResultModel, throwError } from '@/domain/test';
import { SaveSurveyResultController } from './save-survey-result-controller';
import {
	HttpRequest,
	LoadSurveyById,
	InvalidParamError,
	forbidden,
	serverError,
	SaveSurveyResult,
	ok
} from './save-survey-result-controller-protocols';
import MockDate from 'mockdate';
import { mockLoadSurveyById, mockSaveSurveyResult } from '@/presentation/test';

describe('SaveSurveyResult Controller', () => {
	beforeAll(() => {
		MockDate.set(new Date());
	});

	afterAll(() => {
		MockDate.reset();
	});
	test('Should call LoadSurveyById with correct values', async () => {
		const { sut, loadSurveyByIdStub } = makeSut();
		const loadSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');
		await sut.handle(mockRequest());
		expect(loadSpy).toHaveBeenCalledWith('any_survey_id');
	});

	test('Should return 403 if LoadSurveyById returns null', async () => {
		const { sut, loadSurveyByIdStub } = makeSut();
		jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null));
		const result = await sut.handle(mockRequest());
		expect(result).toEqual(forbidden(new InvalidParamError('surveyId')));
	});

	test('Should return 500 on if load survey by id throws', async () => {
		const { sut, loadSurveyByIdStub } = makeSut();
		jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(throwError);
		const httpResponse = await sut.handle(mockRequest());
		expect(httpResponse).toEqual(serverError(new Error()));
	});

	test('Should return 403 if an invalid answer is provided', async () => {
		const { sut } = makeSut();

		const result = await sut.handle({
			params: {
				surveyId: 'any_survey_id'
			},
			body: {
				answer: 'wrong_answer'
			}
		});
		expect(result).toEqual(forbidden(new InvalidParamError('answer')));
	});

	test('Should call SaveSurveyResult with correct values', async () => {
		const { sut, saveSurveyResult } = makeSut();
		const saveSpy = jest.spyOn(saveSurveyResult, 'save');
		await sut.handle(mockRequest());
		expect(saveSpy).toHaveBeenCalledWith({
			surveyId: 'any_survey_id',
			accountId: 'any_account_id',
			date: new Date(),
			answer: 'any_answer'
		});
	});

	test('Should return 500 on if SaveSurveyResult throws', async () => {
		const { sut, saveSurveyResult } = makeSut();
		jest.spyOn(saveSurveyResult, 'save').mockImplementationOnce(throwError);
		const httpResponse = await sut.handle(mockRequest());
		expect(httpResponse).toEqual(serverError(new Error()));
	});

	test('Should return 200 on success', async () => {
		const { sut } = makeSut();
		const httpResponse = await sut.handle(mockRequest());
		expect(httpResponse).toEqual(ok(mockSurveyResultModel()));
	});

	const mockRequest = (): HttpRequest => {
		return {
			params: {
				surveyId: 'any_survey_id'
			},
			body: {
				answer: 'any_answer'
			},
			accountId: 'any_account_id'
		};
	};

	type SutTypes = {
		sut: SaveSurveyResultController;
		loadSurveyByIdStub: LoadSurveyById;
		saveSurveyResult: SaveSurveyResult;
	};

	const makeSut = (): SutTypes => {
		const loadSurveyByIdStub = mockLoadSurveyById();
		const saveSurveyResult = mockSaveSurveyResult();
		const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResult);
		return {
			sut,
			loadSurveyByIdStub,
			saveSurveyResult
		};
	};
});
