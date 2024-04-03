type SurveyModel = {
	id: string;
	question: string;
	answers: SurveysAnswerModel[];
	date: Date;
};

type SurveysAnswerModel = {
	image?: string;
	answer: string;
};

export { SurveyModel, SurveysAnswerModel };
