import { AddSurveyModel } from '@/domain/usecases/survey/add-survey';

export interface AddSurveyRepository {
	add(account: AddSurveyModel): Promise<void>;
}
