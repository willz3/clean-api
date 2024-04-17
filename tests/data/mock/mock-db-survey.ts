import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository';
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository';
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository';
import { mockSurveyModel, mockSurveyModels } from '../../domain/mock';
import { AddSurvey } from '@/domain/usecases/survey/add-survey';
import { CheckSurveyByIdRepository } from '@/data/protocols/db/survey/check-survey-by-id-repository';

export class AddSurveyRepositorySpy implements AddSurveyRepository {
	addSurveyParams: AddSurvey.Params;

	async add(data: AddSurvey.Params): Promise<AddSurvey.Result> {
		this.addSurveyParams = data;
		return Promise.resolve();
	}
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
	result = mockSurveyModel();
	id: string;

	async loadById(
		id: LoadSurveyByIdRepository.Param
	): Promise<LoadSurveyByIdRepository.Result> {
		this.id = id;
		return Promise.resolve(this.result);
	}
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
	result = mockSurveyModels();
	accountId: string;

	async loadAll(
		accountId: LoadSurveysRepository.Param
	): Promise<LoadSurveysRepository.Result> {
		this.accountId = accountId;
		return Promise.resolve(this.result);
	}
}

export class CheckSurveyByIdRepositorySpy implements CheckSurveyByIdRepository {
	result = true;
	id: string;

	async checkById(
		id: CheckSurveyByIdRepository.Param
	): Promise<CheckSurveyByIdRepository.Result> {
		this.id = id;
		return this.result;
	}
}
