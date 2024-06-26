import {
	SaveSurveyResultRepositorySpy,
	LoadSurveyResultRepositorySpy
} from '@/tests/data/mock';
import { throwError, mockSaveSurveyResultParams } from '@/tests/domain/mock';
import MockDate from 'mockdate';
import { DbSaveSurveyResult } from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result';

type SutTypes = {
	sut: DbSaveSurveyResult;
	saveSurveyResultRepositorySpy: SaveSurveyResultRepositorySpy;
	loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy;
};

const makeSut = (): SutTypes => {
	const saveSurveyResultRepositorySpy = new SaveSurveyResultRepositorySpy();
	const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy();
	const sut = new DbSaveSurveyResult(
		saveSurveyResultRepositorySpy,
		loadSurveyResultRepositorySpy
	);
	return {
		sut,
		saveSurveyResultRepositorySpy,
		loadSurveyResultRepositorySpy
	};
};

describe('DbSaveSurveyResult Usecase', () => {
	beforeAll(() => {
		MockDate.set(new Date());
	});

	afterAll(() => {
		MockDate.reset();
	});

	test('Should call SaveSurveyResultRepository with correct values', async () => {
		const { sut, saveSurveyResultRepositorySpy } = makeSut();
		const surveyResultData = mockSaveSurveyResultParams();
		await sut.save(surveyResultData);
		expect(saveSurveyResultRepositorySpy.saveSurveyResultParams).toEqual(
			surveyResultData
		);
	});

	test('Should throw if SaveSurveyResultRepository throws', async () => {
		const { sut, saveSurveyResultRepositorySpy } = makeSut();
		jest.spyOn(saveSurveyResultRepositorySpy, 'save').mockImplementationOnce(throwError);
		const promise = sut.save(mockSaveSurveyResultParams());
		await expect(promise).rejects.toThrow();
	});

	test('Should call LoadSurveyResultRepository with correct values', async () => {
		const { sut, loadSurveyResultRepositorySpy } = makeSut();
		const surveyResultData = mockSaveSurveyResultParams();
		await sut.save(surveyResultData);
		expect(loadSurveyResultRepositorySpy.surveyId).toBe(surveyResultData.surveyId);
		expect(loadSurveyResultRepositorySpy.accountId).toBe(surveyResultData.accountId);
	});

	test('Should throw if LoadSurveyResultRepository throws', async () => {
		const { sut, loadSurveyResultRepositorySpy } = makeSut();
		jest
			.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId')
			.mockImplementationOnce(throwError);
		const promise = sut.save(mockSaveSurveyResultParams());
		await expect(promise).rejects.toThrow();
	});

	test('Should return SurveyResult on success', async () => {
		const { sut, loadSurveyResultRepositorySpy } = makeSut();
		const surveyResult = await sut.save(mockSaveSurveyResultParams());
		expect(surveyResult).toEqual(loadSurveyResultRepositorySpy.surveyResultModel);
	});
});
