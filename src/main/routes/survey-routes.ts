import { Router } from 'express';
import { adapterRoute } from '../adapters/express/express-routes-adapter';
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory';
import { makeLoadSurveysController } from '../factories/controllers/survey/load-surveys/load-surveys-controller-factory';
import { withAdminAuth, withAuth } from '../middlewares/auth';

export default (router: Router) => {
	router.post('/surveys', withAdminAuth, adapterRoute(makeAddSurveyController()));
	router.get('/surveys', withAuth, adapterRoute(makeLoadSurveysController()));
};
