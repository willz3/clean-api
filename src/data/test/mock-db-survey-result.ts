import { SurveyResultModel } from '@/domain/model/survey-result';
import { mockSurveyResultModel } from '@/domain/test';
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result';
import { SaveSurveyResultRepository } from '@/infra/db/mongodb/survey-result/survey-result-mongo-repository-protocols';
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository';

const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
	class SaveSurveyResultRepository implements SaveSurveyResultRepository {
		async save(data: SaveSurveyResultParams): Promise<void> {
			return null;
		}
	}

	return new SaveSurveyResultRepository();
};

const mockLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
	class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
		async loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
			return Promise.resolve(mockSurveyResultModel());
		}
	}
	return new LoadSurveyResultRepositoryStub();
};

export { mockSaveSurveyResultRepository, mockLoadSurveyResultRepository };
