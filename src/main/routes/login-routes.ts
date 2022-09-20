import { Router } from 'express';
import { adapterRoute } from '../adapters/express/express-routes-adapter';
import { makeLoginController } from '../factories/controllers/login/login-controller-factory';
import { makeSignUpController } from '../factories/controllers/signup/signup-controller-factory';

export default (router: Router) => {
	router.post('/signup', adapterRoute(makeSignUpController()));
	router.post('/login', adapterRoute(makeLoginController()));
};
