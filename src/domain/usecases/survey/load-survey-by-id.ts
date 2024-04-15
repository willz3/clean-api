import { SurveyModel } from '@/domain/model/survey';

export interface LoadSurveyById {
	loadById(id: LoadSurveyById.Param): Promise<LoadSurveyById.Result>;
}

export namespace LoadSurveyById {
	export type Param = string;
	export type Result = SurveyModel;
}
