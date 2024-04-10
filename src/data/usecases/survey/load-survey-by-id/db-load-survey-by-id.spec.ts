import { mockSurveyModel, throwError } from '@/domain/test';
import { DbLoadSurveyById } from './db-load-survey-by-id';
import { LoadSurveyByIdRepository } from './db-load-survey-by-id-protocols';
import MockDate from 'mockdate';
import { mockLoadSurveyByIdRepository } from '@/data/test';

describe('DbLoadSurveyById', () => {
	beforeAll(async () => {
		MockDate.set(new Date());
	});

	afterAll(async () => {
		MockDate.reset();
	});

	test('Should call LoadSurveysRepository', async () => {
		const { sut, loadSurveyByIdRepositoryStub } = makeSut();
		const loadSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById');
		await sut.loadById('any_id');
		expect(loadSpy).toHaveBeenCalled();
	});

	test('Should return a SurveyModel on success', async () => {
		const { sut } = makeSut();
		const result = await sut.loadById('any_id');
		expect(result).toEqual(mockSurveyModel());
	});

	test('Should throw if repository throws', async () => {
		const { sut, loadSurveyByIdRepositoryStub } = makeSut();

		jest
			.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
			.mockImplementationOnce(throwError);

		const promise = sut.loadById('any_id');
		await expect(promise).rejects.toThrow();
	});

	type SutTypes = {
		sut: DbLoadSurveyById;
		loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
	};

	const makeSut = (): SutTypes => {
		const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository();
		const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub);
		return {
			sut,
			loadSurveyByIdRepositoryStub
		};
	};
});
