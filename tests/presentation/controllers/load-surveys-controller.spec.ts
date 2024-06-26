import { LoadSurveysController } from '@/presentation/controllers/survey/load-surveys/load-surveys-controller';
import { ok, serverError, noContent } from '@/presentation/helpers/http/http-helper';
import { LoadSurveysSpy } from '@/tests/presentation/mock';
import { throwError } from '@/tests/domain/mock';
import MockDate from 'mockdate';
import faker from 'faker';

type SutTypes = {
	sut: LoadSurveysController;
	loadSurveysSpy: LoadSurveysSpy;
};

const makeSut = (): SutTypes => {
	const loadSurveysSpy = new LoadSurveysSpy();
	const sut = new LoadSurveysController(loadSurveysSpy);
	return {
		sut,
		loadSurveysSpy
	};
};

const mockRequest = (): LoadSurveysController.Request => {
	return {
		accountId: faker.random.uuid()
	};
};

describe('LoadSurveys Controller', () => {
	beforeAll(() => {
		MockDate.set(new Date());
	});

	afterAll(() => {
		MockDate.reset();
	});

	test('Should call LoadSurveys', async () => {
		const { sut, loadSurveysSpy } = makeSut();
		const request = mockRequest();
		await sut.handle(request);
		expect(loadSurveysSpy.accountId).toBe(request.accountId);
	});

	test('Should return 200 on success', async () => {
		const { sut, loadSurveysSpy } = makeSut();
		const httpResponse = await sut.handle(mockRequest());
		expect(httpResponse).toEqual(ok(loadSurveysSpy.result));
	});

	test('Should return 204 if LoadSurveys returns empty', async () => {
		const { sut, loadSurveysSpy } = makeSut();
		loadSurveysSpy.result = [];
		const httpResponse = await sut.handle(mockRequest());
		expect(httpResponse).toEqual(noContent());
	});

	test('Should return 500 if LoadSurveys throws', async () => {
		const { sut, loadSurveysSpy } = makeSut();
		jest.spyOn(loadSurveysSpy, 'load').mockImplementationOnce(throwError);
		const httpResponse = await sut.handle(mockRequest());
		expect(httpResponse).toEqual(serverError(new Error()));
	});
});
