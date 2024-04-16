import { SurveyModel } from '@/domain/model/survey';

export interface AddSurvey {
	add(account: AddSurvey.Params): Promise<AddSurvey.Result>;
}

export namespace AddSurvey {
	export type Params = Omit<SurveyModel, 'id'>;

	export type Result = void;
}
