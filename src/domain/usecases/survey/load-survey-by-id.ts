import { SurveyModel } from '@/domain/model/survey';

export interface LoadSurveyById {
	loadById(id: string): Promise<SurveyModel>;
}
