type SurveyModel = {
	id: string;
	question: string;
	answers: SurveysAnswerModel[];
	date: Date;
	didAnswer?: boolean;
};

type SurveysAnswerModel = {
	image?: string;
	answer: string;
};

export { SurveyModel };
