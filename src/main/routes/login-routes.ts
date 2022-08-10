import { Router } from "express";
import { adapterRoute } from "../adapters/express/express-routes-adapter";
import { makeSignUpController } from "../factories/signup/signup-factory";
import { makeLoginController } from "../factories/login/login-factory";

export default (router: Router) => {
	router.post("/signup", adapterRoute(makeSignUpController()));
	router.post("/login", adapterRoute(makeLoginController()));
};
