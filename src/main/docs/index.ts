import { badRequest, forbidden, notFound, serverError, unauthorized } from './components';
import { loginPath, signUpPath, surveyPath } from './paths';
import {
	accountSchema,
	apiKeyAuthSchema,
	errorSchema,
	loginParamsSchema,
	signUpParamsSchema,
	surveyAnswerSchema,
	surveySchema,
	surveysSchema,
	addSurveyParamsSchema
} from './schemas';

export default {
	openapi: '3.0.0',
	info: {
		title: 'Clean Node API',
		description: 'A node api created using clean arch and SOLID principles.',
		version: '1.0.0'
	},
	license: {
		name: 'GPL-3.0-or-later',
		url: 'https://spdx.org/licenses/GPL-3.0-or-later.html'
	},
	servers: [
		{
			url: '/api'
		}
	],
	tags: [
		{
			name: 'Login'
		},
		{
			name: 'Survey'
		}
	],
	paths: {
		'/login': loginPath,
		'/surveys': surveyPath,
		'/sign-up': signUpPath
	},
	schemas: {
		account: accountSchema,
		loginParams: loginParamsSchema,
		error: errorSchema,
		surveys: surveysSchema,
		survey: surveySchema,
		surveyAnswer: surveyAnswerSchema,
		addSUrveyParams: addSurveyParamsSchema,
		signUpParams: signUpParamsSchema
	},
	components: {
		securitySchemes: {
			apiKeyAuth: apiKeyAuthSchema
		},
		badRequest,
		serverError,
		unauthorized,
		notFound,
		forbidden
	}
};
