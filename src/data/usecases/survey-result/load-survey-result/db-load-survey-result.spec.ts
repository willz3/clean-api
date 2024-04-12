import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository';
import { DbLoadSurveyResult } from './db-load-survey-result';
import { SurveyResultModel } from '@/domain/model/survey-result';
import { mockSurveyResultModel } from '@/domain/test';

describe('DbLoadSurveyResult use case', () => {
	test('Should call LoadSurveyResultRepository with correct values', async () => {
		const { sut, loadSurveyResultRepositoryStub } = makeSut();
		const loadBySurveyIdSpy = jest.spyOn(
			loadSurveyResultRepositoryStub,
			'loadBySurveyId'
		);
		await sut.load('any_survey_id');
		expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id');
	});

	type SutTypes = {
		sut: DbLoadSurveyResult;
		loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
	};

	const makeSut = (): SutTypes => {
		const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository();
		const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub);
		return {
			sut,
			loadSurveyResultRepositoryStub
		};
	};

	const mockLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
		class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
			async loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
				return Promise.resolve(mockSurveyResultModel());
			}
		}
		return new LoadSurveyResultRepositoryStub();
	};
});