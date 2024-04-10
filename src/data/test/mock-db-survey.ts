import { mockSurveyModel, mockSurveyModels } from '@/domain/test';
import {
	AddSurveyParams,
	AddSurveyRepository,
	LoadSurveyByIdRepository,
	LoadSurveysRepository,
	SurveyModel
} from '@/infra/db/mongodb/survey/survey-mongo-repository-protocols';

const mockAddSurveyRepository = (): AddSurveyRepository => {
	class AddSurveyRepositoryStub implements AddSurveyRepository {
		async add(account: AddSurveyParams): Promise<void> {
			return null;
		}
	}

	return new AddSurveyRepositoryStub();
};

const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
	class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
		async loadById(): Promise<SurveyModel | null> {
			return mockSurveyModel();
		}
	}

	return new LoadSurveyByIdRepositoryStub();
};

const mockLoadSurveysRepository = (): LoadSurveysRepository => {
	class LoadSurveysRepository implements LoadSurveysRepository {
		async loadAll(): Promise<SurveyModel[]> {
			return mockSurveyModels();
		}
	}

	return new LoadSurveysRepository();
};

export {
	mockAddSurveyRepository,
	mockLoadSurveyByIdRepository,
	mockLoadSurveysRepository
};
