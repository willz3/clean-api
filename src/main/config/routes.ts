/* eslint-disable n/no-path-concat */
import { Express, Router } from 'express';
import { readdirSync } from 'fs';

export default (app: Express): void => {
	const router = Router();
	app.use('/api', router);
	readdirSync(`${__dirname}/../routes`).map(async (file) => {
		if (!file.includes('.test.ts') && !file.endsWith('.map'))
			(await import(`../routes/${file}`)).default(router);
	});
};
