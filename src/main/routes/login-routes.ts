import { Router } from 'express';
import { adapterRoute } from '@/main/adapters/express/express-routes-adapter';
import { makeLoginController } from '@/main/factories/controllers/login/login/login-controller-factory';
import { makeSignUpController } from '@/main/factories/controllers/login/signup/signup-controller-factory';

export default (router: Router) => {
	router.post('/signup', adapterRoute(makeSignUpController()));
	router.post('/login', adapterRoute(makeLoginController()));
};
