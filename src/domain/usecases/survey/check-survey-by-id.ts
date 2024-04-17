export interface CheckSurveyById {
	checkById(id: CheckSurveyById.Param): Promise<CheckSurveyById.Result>;
}

export namespace CheckSurveyById {
	export type Param = string;
	export type Result = boolean;
}
