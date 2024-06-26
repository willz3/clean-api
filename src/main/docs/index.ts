import components from './components';
import paths from './paths';
import schemas from './schemas';

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
	paths,
	schemas,
	components
};
