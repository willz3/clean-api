import { LoadSurveyResultController } from '@/presentation/controllers/suvey-result/load-survey-result/load-survey-result-controller';
import { CheckSurveyByIdSpy, LoadSurveyResultSpy } from '@/tests/presentation/mock';
import { forbidden, serverError, ok } from '@/presentation/helpers/http/http-helper';
import { InvalidParamError } from '@/presentation/errors';
import { throwError } from '@/tests/domain/mock';
import MockDate from 'mockdate';
import faker from 'faker';

const mockRequest = (): LoadSurveyResultController.Request => ({
	surveyId: faker.random.uuid(),
	accountId: faker.random.uuid()
});

type SutTypes = {
	sut: LoadSurveyResultController;
	checkSurveyByIdSpy: CheckSurveyByIdSpy;
	loadSurveyResultSpy: LoadSurveyResultSpy;
};

const makeSut = (): SutTypes => {
	const checkSurveyByIdSpy = new CheckSurveyByIdSpy();
	const loadSurveyResultSpy = new LoadSurveyResultSpy();
	const sut = new LoadSurveyResultController(checkSurveyByIdSpy, loadSurveyResultSpy);
	return {
		sut,
		checkSurveyByIdSpy,
		loadSurveyResultSpy
	};
};

describe('LoadSurveyResult Controller', () => {
	beforeAll(() => {
		MockDate.set(new Date());
	});

	afterAll(() => {
		MockDate.reset();
	});

	test('Should call LoadSurveyById with correct value', async () => {
		const { sut, checkSurveyByIdSpy } = makeSut();
		const request = mockRequest();
		await sut.handle(request);
		expect(checkSurveyByIdSpy.id).toBe(request.surveyId);
	});

	test('Should return 403 if LoadSurveyById returns null', async () => {
		const { sut, checkSurveyByIdSpy } = makeSut();
		checkSurveyByIdSpy.result = false;
		const httpResponse = await sut.handle(mockRequest());
		expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
	});

	test('Should return 500 if LoadSurveyById throws', async () => {
		const { sut, checkSurveyByIdSpy } = makeSut();
		jest.spyOn(checkSurveyByIdSpy, 'checkById').mockImplementationOnce(throwError);
		const httpResponse = await sut.handle(mockRequest());
		expect(httpResponse).toEqual(serverError(new Error()));
	});

	test('Should call LoadSurveyResult with correct value', async () => {
		const { sut, loadSurveyResultSpy } = makeSut();
		const request = mockRequest();
		await sut.handle(request);
		expect(loadSurveyResultSpy.surveyId).toBe(request.surveyId);
		expect(loadSurveyResultSpy.accountId).toBe(request.accountId);
	});

	test('Should return 500 if LoadSurveyResult throws', async () => {
		const { sut, loadSurveyResultSpy } = makeSut();
		jest.spyOn(loadSurveyResultSpy, 'load').mockImplementationOnce(throwError);
		const httpResponse = await sut.handle(mockRequest());
		expect(httpResponse).toEqual(serverError(new Error()));
	});

	test('Should return 200 on success', async () => {
		const { sut, loadSurveyResultSpy } = makeSut();
		const httpResponse = await sut.handle(mockRequest());
		expect(httpResponse).toEqual(ok(loadSurveyResultSpy.result));
	});
});
