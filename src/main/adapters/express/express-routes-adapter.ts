import { Controller } from '@/presentation/protocols';
import { Request, Response } from 'express';

export const adapterRoute = (controller: Controller<any>) => {
	return async (request: Request, response: Response) => {
		const httpRequest = {
			...(request.body || {}),
			...(request.params || {}),
			accountId: request.accountId
		};
		const httpResponse = await controller.handle(httpRequest);
		if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
			response.status(httpResponse.statusCode).json(httpResponse.body);
		} else {
			response.status(httpResponse.statusCode).json({
				error: httpResponse.body.message
			});
		}
	};
};
