import { loginPath, signUpPath, surveyPath, surveyResultPath } from './paths/';

export default {
	'/login': loginPath,
	'/surveys': surveyPath,
	'/sign-up': signUpPath,
	'surveys/{survey_id}/results': surveyResultPath
};
