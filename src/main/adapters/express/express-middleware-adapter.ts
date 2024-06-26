import { Middleware } from '@/presentation/protocols';
import { NextFunction, Request, Response } from 'express';

export const adapterMiddleware = (middleware: Middleware<any>) => {
	return async (request: Request, response: Response, next: NextFunction) => {
		const httpRequest = {
			accessToken: request.headers?.['x-access-token'],
			...(request.headers || {})
		};

		const httpResponse = await middleware.handle(httpRequest);
		if (httpResponse.statusCode === 200) {
			Object.assign(request, httpResponse.body);
			next();
		} else {
			response.status(httpResponse.statusCode).json({
				error: httpResponse.body.message
			});
		}
	};
};
