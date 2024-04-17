export interface LoadAnswersBySurvey {
	loadAnswers(id: LoadAnswersBySurvey.Param): Promise<LoadAnswersBySurvey.Result>;
}

export namespace LoadAnswersBySurvey {
	export type Param = string;
	export type Result = Array<string>;
}
