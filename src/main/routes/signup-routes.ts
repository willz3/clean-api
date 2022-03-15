import { Router } from "express";
import { makeSignUpController } from "../factories/signup";
import { adapterRoute } from "../adapters/express-routes-adapter";

export default (router: Router) => {
	router.post("/signup", adapterRoute(makeSignUpController()));
};
