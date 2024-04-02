import { Router } from 'express';
import { adapterRoute } from '../adapters/express/express-routes-adapter';
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory';
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware';
import { adapterMiddleware } from '../adapters/express/express-middleware-adapter';

export default (router: Router) => {
	router.post(
		'/surveys',
		adapterMiddleware(makeAuthMiddleware('admin')),
		adapterRoute(makeAddSurveyController())
	);
};
