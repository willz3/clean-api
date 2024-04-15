import { SurveyModel } from '@/domain/model/survey';

export interface LoadSurveysRepository {
	loadAll(accountId: LoadSurveysRepository.Param): Promise<LoadSurveysRepository.Result>;
}

export namespace LoadSurveysRepository {
	export type Param = string;
	export type Result = Array<SurveyModel>;
}
