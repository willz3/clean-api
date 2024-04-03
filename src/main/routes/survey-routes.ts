import { Router } from 'express';
import { adapterRoute } from '../adapters/express/express-routes-adapter';
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory';
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware';
import { adapterMiddleware } from '../adapters/express/express-middleware-adapter';
import { makeLoadSurveysController } from '../factories/controllers/survey/load-surveys/load-surveys-controller-factory';

export default (router: Router) => {
	router.post(
		'/surveys',
		adapterMiddleware(makeAuthMiddleware('admin')),
		adapterRoute(makeAddSurveyController())
	);
	router.get(
		'/surveys',
		adapterMiddleware(makeAuthMiddleware()),
		adapterRoute(makeLoadSurveysController())
	);
};
