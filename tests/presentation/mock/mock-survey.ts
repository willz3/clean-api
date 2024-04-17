import { AddSurvey } from '@/domain/usecases/survey/add-survey';
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys';
import { mockSurveyModels } from '../../domain/mock';
import { CheckSurveyById } from '@/domain/usecases/survey/check-survey-by-id';
import { LoadAnswersBySurvey } from '@/domain/usecases/survey/load-answers-by-survey';

import faker from 'faker';

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

export class LoadAnswersBySurveySpy implements LoadAnswersBySurvey {
	result = [faker.random.word(), faker.random.word()];
	id: string;

	async loadAnswers(id: LoadAnswersBySurvey.Param): Promise<LoadAnswersBySurvey.Result> {
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
