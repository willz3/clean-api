export type AddSurveyModel = {
	question: string;
	answers: SurveyAnswer[];
};

export type SurveyAnswer = {
	image: string;
	answer: string;
};

export interface AddSurvey {
	add(account: AddSurveyModel): Promise<void>;
}
