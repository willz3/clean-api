import { AddSurveyParams } from '@/domain/usecases/survey/add-survey';

export interface AddSurveyRepository {
	add(account: AddSurveyParams): Promise<void>;
}
