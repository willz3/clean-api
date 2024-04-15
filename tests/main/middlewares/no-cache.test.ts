import request from 'supertest';
import { noCache } from '@/main/middlewares/no-cache/no-cache';
import app from '@/main/config/app';

describe('NoCache Middleware', () => {
	test('Should disable cache', async () => {
		app.get('/test_no_cache', noCache, (request, response) => {
			response.send();
		});

		const httpResponse = await request(app).get('/test_no_cache');

		expect(httpResponse.header['cache-control']).toEqual(
			'no-store, no-cache, must-revalidate, proxy-revalidate'
		);
		expect(httpResponse.header.pragma).toEqual('no-cache');
		expect(httpResponse.header.expires).toEqual('0');
		expect(httpResponse.header['surrogate-control']).toEqual('no-store');
	});
});
