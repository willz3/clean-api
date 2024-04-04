import { SurveysAnswerModel } from '@/domain/model/survey';

export type AddSurveyModel = {
	question: string;
	answers: SurveysAnswerModel[];
	date: Date;
};

export interface AddSurvey {
	add(account: AddSurveyModel): Promise<void>;
}
