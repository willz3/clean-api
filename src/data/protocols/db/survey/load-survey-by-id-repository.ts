import { SurveyModel } from '@/domain/model/survey';

export interface LoadSurveyByIdRepository {
	loadById(id: LoadSurveyByIdRepository.Param): Promise<LoadSurveyByIdRepository.Result>;
}

export namespace LoadSurveyByIdRepository {
	export type Param = string;
	export type Result = SurveyModel | null;
}
