import { SurveyModel } from '@/domain/model/survey';

export interface LoadSurveys {
	load(): Promise<SurveyModel[]>;
}
