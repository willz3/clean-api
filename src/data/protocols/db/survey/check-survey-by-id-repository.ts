export interface CheckSurveyByIdRepository {
	checkById(
		id: CheckSurveyByIdRepository.Param
	): Promise<CheckSurveyByIdRepository.Result>;
}

export namespace CheckSurveyByIdRepository {
	export type Param = string;
	export type Result = boolean;
}
