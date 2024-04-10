import MockDate from 'mockdate';
import { DbLoadSurveys } from './db-load-surveys';
import { LoadSurveysRepository } from './db-load-surveys-protocols';
import { mockSurveyModels, throwError } from '@/domain/test';
import { mockLoadSurveysRepository } from '@/data/test';

describe('DbLoadSurveys', () => {
	beforeAll(async () => {
		MockDate.set(new Date());
	});

	afterAll(async () => {
		MockDate.reset();
	});

	test('Should call LoadSurveysRepository', async () => {
		const { sut, loadSurveysRepositoryStub } = makeSut();
		const loadSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll');
		await sut.load();
		expect(loadSpy).toHaveBeenCalled();
	});

	test('Should return a list of Surveys on success', async () => {
		const { sut } = makeSut();
		const result = await sut.load();
		expect(result).toEqual(mockSurveyModels());
	});

	test('Should throw if repository throws', async () => {
		const { sut, loadSurveysRepositoryStub } = makeSut();

		jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockImplementationOnce(throwError);

		const promise = sut.load();
		await expect(promise).rejects.toThrow();
	});

	type SutTypes = {
		sut: DbLoadSurveys;
		loadSurveysRepositoryStub: LoadSurveysRepository;
	};

	const makeSut = (): SutTypes => {
		const loadSurveysRepositoryStub = mockLoadSurveysRepository();
		const sut = new DbLoadSurveys(loadSurveysRepositoryStub);
		return {
			sut,
			loadSurveysRepositoryStub
		};
	};
});
