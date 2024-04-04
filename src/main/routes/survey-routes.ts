import { Router } from 'express';
import { adapterRoute } from '@/main/adapters/express/express-routes-adapter';
import { makeAddSurveyController } from '@/main/factories/controllers/survey/add-survey/add-survey-controller-factory';
import { makeLoadSurveysController } from '@/main/factories/controllers/survey/load-surveys/load-surveys-controller-factory';
import { withAdminAuth, withAuth } from '@/main/middlewares/auth';

export default (router: Router) => {
	router.post('/surveys', withAdminAuth, adapterRoute(makeAddSurveyController()));
	router.get('/surveys', withAuth, adapterRoute(makeLoadSurveysController()));
};
