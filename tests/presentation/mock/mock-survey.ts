import { AddSurvey } from '@/domain/usecases/survey/add-survey';
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id';
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys';
import { mockSurveyModels, mockSurveyModel } from '../../domain/mock';

export class AddSurveySpy implements AddSurvey {
	addSurveyParams: AddSurvey.Params;

	async add(data: AddSurvey.Params): Promise<AddSurvey.Result> {
		this.addSurveyParams = data;
		return Promise.resolve();
	}
}

export class LoadSurveysSpy implements LoadSurveys {
	surveyModels = mockSurveyModels();
	accountId: string;

	async load(accountId: LoadSurveys.Param): Promise<LoadSurveys.Result> {
		this.accountId = accountId;
		return Promise.resolve(this.surveyModels);
	}
}

export class LoadSurveyByIdSpy implements LoadSurveyById {
	surveyModel = mockSurveyModel();
	id: string;

	async loadById(id: LoadSurveyById.Param): Promise<LoadSurveyById.Result> {
		this.id = id;
		return Promise.resolve(this.surveyModel);
	}
}
