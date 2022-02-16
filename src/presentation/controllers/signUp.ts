import { HttpRequest, HttpResponse } from "../protocols/http";
import { MissingParamError } from "../errors/missing-param-error";
import { badRequest } from "../helpers/httpHelper";

export class SignUpController {
	handle(httpRquest: HttpRequest): HttpResponse {
		if (!httpRquest.body.name) {
			return badRequest(new MissingParamError("name"));
		}

		if (!httpRquest.body.email) {
			return badRequest(new MissingParamError("email"));
		}
	}
}
