import { DbSaveSurveyResult } from './db-save-survey-result';
import {
	LoadSurveyResultRepository,
	SaveSurveyResultRepository
} from './db-save-survey-result-protocols';

import MockDate from 'mockdate';
import {
	mockSaveSurveyResultParams,
	mockSurveyResultModel,
	throwError
} from '@/domain/test';
import {
	mockLoadSurveyResultRepository,
	mockSaveSurveyResultRepository
} from '@/data/test';

describe('DbSaveSurveyResult UseCase', () => {
	beforeAll(() => {
		MockDate.set(new Date());
	});

	afterAll(() => {
		MockDate.reset();
	});

	test('Should call SaveSurveyResultRepository with correct values', async () => {
		const { sut, saveSurveyResultRepositoryStub } = makeSut();
		const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save');
		const data = mockSaveSurveyResultParams();
		await sut.save(data);

		expect(saveSpy).toHaveBeenCalledWith(data);
	});

	test('Should call LoadSurveyResultRepository with correct values', async () => {
		const { sut, loadSurveyResultRepositoryStub } = makeSut();
		const loadSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId');
		const data = mockSaveSurveyResultParams();
		await sut.save(data);

		expect(loadSpy).toHaveBeenCalledWith(data.surveyId);
	});

	test('Should return SurveyResultModel on success', async () => {
		const { sut } = makeSut();
		const result = await sut.save(mockSaveSurveyResultParams());
		expect(result).toEqual(mockSurveyResultModel());
	});

	test('Should throw if SaveSurveyResultRepository throws', async () => {
		const { sut, saveSurveyResultRepositoryStub } = makeSut();
		jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementationOnce(throwError);

		expect(sut.save(mockSaveSurveyResultParams())).rejects.toThrow();
	});
});

type SutTypes = {
	sut: DbSaveSurveyResult;
	saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
	loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
};

const makeSut = (): SutTypes => {
	const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository();
	const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository();
	const sut = new DbSaveSurveyResult(
		saveSurveyResultRepositoryStub,
		loadSurveyResultRepositoryStub
	);
	return {
		sut,
		saveSurveyResultRepositoryStub,
		loadSurveyResultRepositoryStub
	};
};
