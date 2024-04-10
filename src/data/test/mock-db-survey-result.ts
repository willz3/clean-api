import { SurveyResultModel } from '@/domain/model/survey-result';
import { mockSurveyResultModel } from '@/domain/test';
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result';
import { SaveSurveyResultRepository } from '@/infra/db/mongodb/survey-result/survey-result-mongo-repository-protocols';

const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
	class SaveSurveyResultRepository implements SaveSurveyResultRepository {
		async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
			return mockSurveyResultModel();
		}
	}

	return new SaveSurveyResultRepository();
};

export { mockSaveSurveyResultRepository };
