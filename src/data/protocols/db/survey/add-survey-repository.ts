import { AddSurvey } from '@/domain/usecases/survey/add-survey';

export interface AddSurveyRepository {
	add(data: AddSurveyRepository.Params): Promise<AddSurveyRepository.Result>;
}

export namespace AddSurveyRepository {
	export type Params = AddSurvey.Params;
	export type Result = void;
}
