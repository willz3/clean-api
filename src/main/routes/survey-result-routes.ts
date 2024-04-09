import { Router } from 'express';
import { adapterRoute } from '@/main/adapters/express/express-routes-adapter';
import { withAuth } from '@/main/middlewares/auth';
import { makeSaveSurveyResultController } from '@/main/factories/controllers/survey-result/save-survey-result/save-survey-result-controller-factory';

export default (router: Router) => {
	router.put(
		'/surveys/:surveyId/results',
		withAuth,
		adapterRoute(makeSaveSurveyResultController())
	);
};
