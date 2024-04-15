import { SurveyModel } from '@/domain/model/survey';

export interface LoadSurveys {
	load(accountId: LoadSurveys.Param): Promise<LoadSurveys.Result>;
}

export namespace LoadSurveys {
	export type Param = string;
	export type Result = Array<SurveyModel>;
}
