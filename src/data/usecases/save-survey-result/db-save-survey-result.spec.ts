import { DbSaveSurveyResult } from './db-save-survey-result';
import { SurveyResultModel } from '@/domain/model/survey-result';
import {
	SaveSurveyResultRepository,
	SaveSurveyResultModel
} from './db-save-survey-result-protocols';

import MockDate from 'mockdate';

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
		const data = makeFakeSaveSurveyResultData();
		await sut.save(data);

		expect(saveSpy).toHaveBeenCalledWith(data);
	});
});

type SutTypes = {
	sut: DbSaveSurveyResult;
	saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
};

const makeSut = (): SutTypes => {
	const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepositoryStub();
	const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub);
	return {
		sut,
		saveSurveyResultRepositoryStub
	};
};

const makeSaveSurveyResultRepositoryStub = (): SaveSurveyResultRepository => {
	class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
		save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
			return Promise.resolve(makeFakeSurveyResultData());
		}
	}

	return new SaveSurveyResultRepositoryStub();
};

const makeFakeSaveSurveyResultData = (): Omit<SurveyResultModel, 'id'> => ({
	accountId: 'any_account_id',
	surveyId: 'any_survey_id',
	answer: 'any_answer',
	date: new Date()
});

const makeFakeSurveyResultData = (): SurveyResultModel => ({
	id: 'any_id',
	accountId: 'any_account_id',
	surveyId: 'any_survey_id',
	answer: 'any_answer',
	date: new Date()
});
