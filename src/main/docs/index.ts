import { badRequest, notFound, serverError, unauthorized } from './components';
import { loginPath } from './paths';
import { accountSchema, errorSchema, loginParamsSchema } from './schemas';

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
		}
	],
	paths: {
		'/login': loginPath
	},
	schemas: {
		account: accountSchema,
		loginParams: loginParamsSchema,
		error: errorSchema
	},
	components: {
		badRequest,
		serverError,
		unauthorized,
		notFound
	}
};
