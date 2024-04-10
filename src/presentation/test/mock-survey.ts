import { SurveyModel } from '@/domain/model/survey';
import { mockSurveyModel, mockSurveyModels } from '@/domain/test';
import { AddSurvey, AddSurveyParams } from '@/domain/usecases/survey/add-survey';
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id';
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys';

const mockAddSurvey = (): AddSurvey => {
	class AddSurveyStub implements AddSurvey {
		async add(input: AddSurveyParams): Promise<void> {
			return null;
		}
	}
	return new AddSurveyStub();
};

const mockLoadSurveys = (): LoadSurveys => {
	class LoadSurveysStub implements LoadSurveys {
		async load(): Promise<SurveyModel[]> {
			return mockSurveyModels();
		}
	}

	return new LoadSurveysStub();
};

const mockLoadSurveyById = (): LoadSurveyById => {
	class LoadSurveyById implements LoadSurveyById {
		async loadById(id: string): Promise<SurveyModel> {
			return mockSurveyModel();
		}
	}

	return new LoadSurveyById();
};

export { mockAddSurvey, mockLoadSurveys, mockLoadSurveyById };
