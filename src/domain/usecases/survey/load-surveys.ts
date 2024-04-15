import { SurveyModel } from '@/domain/model/survey';

export interface LoadSurveys {
	load(accountId: string): Promise<SurveyModel[]>;
}
