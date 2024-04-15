import { SurveysAnswerModel } from '@/domain/model/survey';

export interface AddSurvey {
	add(account: AddSurvey.Params): Promise<AddSurvey.Result>;
}

export namespace AddSurvey {
	export type Params = {
		question: string;
		answers: SurveysAnswerModel[];
		date: Date;
		didAnswer?: boolean;
	};
	export type Result = void;
}
