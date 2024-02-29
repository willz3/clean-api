import { Router } from 'express';
import { adapterRoute } from '../adapters/express/express-routes-adapter';
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey-controller-factory';

export default (router: Router) => {
	router.post('/surveys', adapterRoute(makeAddSurveyController()));
};
