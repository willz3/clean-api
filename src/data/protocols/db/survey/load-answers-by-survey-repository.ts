export interface LoadAnswersBySurveyRepository {
	loadAnswers(
		id: LoadAnswersBySurveyRepository.Param
	): Promise<LoadAnswersBySurveyRepository.Result>;
}

export namespace LoadAnswersBySurveyRepository {
	export type Param = string;
	export type Result = Array<string>;
}
