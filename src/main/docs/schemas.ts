import {
	accountSchema,
	errorSchema,
	loginParamsSchema,
	signUpParamsSchema,
	surveyAnswerSchema,
	surveySchema,
	surveysSchema,
	addSurveyParamsSchema,
	saveSurveyParamsSchema,
	surveyResultSchema
} from './schemas/';

export default {
	account: accountSchema,
	loginParams: loginParamsSchema,
	error: errorSchema,
	surveys: surveysSchema,
	survey: surveySchema,
	surveyAnswer: surveyAnswerSchema,
	addSUrveyParams: addSurveyParamsSchema,
	signUpParams: signUpParamsSchema,
	saveSurveyParams: saveSurveyParamsSchema,
	surveyResult: surveyResultSchema
};
