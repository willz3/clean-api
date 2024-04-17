import { throwError } from '@/tests/domain/mock';
import MockDate from 'mockdate';
import faker from 'faker';
import { DbCheckSurveyById } from '@/data/usecases/survey/check-survey-by-id/db-check-survey-by-id';
import { CheckSurveyByIdRepositorySpy } from '@/tests/data/mock';

type SutTypes = {
	sut: DbCheckSurveyById;
	checkSurveyByIdRepositorySpy: CheckSurveyByIdRepositorySpy;
};

const makeSut = (): SutTypes => {
	const checkSurveyByIdRepositorySpy = new CheckSurveyByIdRepositorySpy();
	const sut = new DbCheckSurveyById(checkSurveyByIdRepositorySpy);
	return {
		sut,
		checkSurveyByIdRepositorySpy
	};
};

let surveyId: string;

describe('DbCheckSurveyById', () => {
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
		const { sut, checkSurveyByIdRepositorySpy } = makeSut();
		await sut.checkById(surveyId);
		expect(checkSurveyByIdRepositorySpy.id).toBe(surveyId);
	});

	test('Should return true if checkSurveyByIdRepository returns true', async () => {
		const { sut, checkSurveyByIdRepositorySpy } = makeSut();
		const exists = await sut.checkById(surveyId);
		expect(exists).toEqual(checkSurveyByIdRepositorySpy.result);
	});

	test('Should return false if checkSurveyByIdRepository returns false', async () => {
		const { sut, checkSurveyByIdRepositorySpy } = makeSut();
		checkSurveyByIdRepositorySpy.result = false;
		const exists = await sut.checkById(surveyId);
		expect(exists).toEqual(checkSurveyByIdRepositorySpy.result);
	});

	test('Should throw if LoadSurveyByIdRepository throws', async () => {
		const { sut, checkSurveyByIdRepositorySpy } = makeSut();
		jest
			.spyOn(checkSurveyByIdRepositorySpy, 'checkById')
			.mockImplementationOnce(throwError);
		const promise = sut.checkById(surveyId);
		await expect(promise).rejects.toThrow();
	});
});
