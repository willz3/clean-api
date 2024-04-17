import { AddSurvey } from '@/domain/usecases/survey/add-survey';
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id';
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys';
import { mockSurveyModels, mockSurveyModel } from '../../domain/mock';
import { CheckSurveyById } from '@/domain/usecases/survey/check-survey-by-id';

export class AddSurveySpy implements AddSurvey {
	params: AddSurvey.Params;

	async add(data: AddSurvey.Params): Promise<AddSurvey.Result> {
		this.params = data;
		return Promise.resolve();
	}
}

export class LoadSurveysSpy implements LoadSurveys {
	result = mockSurveyModels();
	accountId: string;

	async load(accountId: LoadSurveys.Param): Promise<LoadSurveys.Result> {
		this.accountId = accountId;
		return this.result;
	}
}

export class LoadSurveyByIdSpy implements LoadSurveyById {
	result = mockSurveyModel();
	id: string;

	async loadById(id: LoadSurveyById.Param): Promise<LoadSurveyById.Result> {
		this.id = id;
		return this.result;
	}
}

export class CheckSurveyByIdSpy implements CheckSurveyById {
	result = true;
	id: string;

	async checkById(id: CheckSurveyById.Param): Promise<CheckSurveyById.Result> {
		this.id = id;
		return this.result;
	}
}
