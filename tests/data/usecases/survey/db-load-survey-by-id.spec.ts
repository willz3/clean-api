import { DbLoadSurveyById } from '@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id';
import { LoadSurveyByIdRepositorySpy } from '@/tests/data/mock';
import { throwError } from '@/tests/domain/mock';
import MockDate from 'mockdate';
import faker from 'faker';

type SutTypes = {
	sut: DbLoadSurveyById;
	loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy;
};

const makeSut = (): SutTypes => {
	const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy();
	const sut = new DbLoadSurveyById(loadSurveyByIdRepositorySpy);
	return {
		sut,
		loadSurveyByIdRepositorySpy
	};
};

let surveyId: string;

describe('DbLoadSurveyById', () => {
	beforeAll(() => {
		MockDate.set(new Date());
	});

	afterAll(() => {
		MockDate.reset();
	});

	beforeEach(() => {
		surveyId = faker.random.uuid();
	});

	test('Should call LoadSurveyByIdRepository', async () => {
		const { sut, loadSurveyByIdRepositorySpy } = makeSut();
		await sut.loadById(surveyId);
		expect(loadSurveyByIdRepositorySpy.id).toBe(surveyId);
	});

	test('Should return Survey on success', async () => {
		const { sut, loadSurveyByIdRepositorySpy } = makeSut();
		const survey = await sut.loadById(surveyId);
		expect(survey).toEqual(loadSurveyByIdRepositorySpy.result);
	});

	test('Should throw if LoadSurveyByIdRepository throws', async () => {
		const { sut, loadSurveyByIdRepositorySpy } = makeSut();
		jest
			.spyOn(loadSurveyByIdRepositorySpy, 'loadById')
			.mockImplementationOnce(throwError);
		const promise = sut.loadById(surveyId);
		await expect(promise).rejects.toThrow();
	});
});
