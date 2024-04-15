import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository';
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository';
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository';
import { mockSurveyModel, mockSurveyModels } from '../../domain/mock';
import { AddSurvey } from '@/domain/usecases/survey/add-survey';

export class AddSurveyRepositorySpy implements AddSurveyRepository {
	addSurveyParams: AddSurvey.Params;

	async add(data: AddSurvey.Params): Promise<void> {
		this.addSurveyParams = data;
		return Promise.resolve();
	}
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
	surveyModel = mockSurveyModel();
	id: string;

	async loadById(
		id: LoadSurveyByIdRepository.Param
	): Promise<LoadSurveyByIdRepository.Result> {
		this.id = id;
		return Promise.resolve(this.surveyModel);
	}
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
	surveyModels = mockSurveyModels();
	accountId: string;

	async loadAll(
		accountId: LoadSurveysRepository.Param
	): Promise<LoadSurveysRepository.Result> {
		this.accountId = accountId;
		return Promise.resolve(this.surveyModels);
	}
}
