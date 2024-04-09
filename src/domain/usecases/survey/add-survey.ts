import { SurveyModel } from '@/domain/model/survey';

export type AddSurveyParams = Omit<SurveyModel, 'id'>;

export interface AddSurvey {
	add(account: AddSurveyParams): Promise<void>;
}
