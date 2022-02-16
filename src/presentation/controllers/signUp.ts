import { HttpRequest, HttpResponse } from "../protocols/http";
import { MissingParamError } from "../errors/missing-param-error";
import { badRequest } from "../helpers/httpHelper";

export class SignUpController {
	handle(httpRquest: HttpRequest): HttpResponse {
		const requiredFields = ["name", "email"];

		for (const field of requiredFields) {
			if (!httpRquest.body[field]) {
				return badRequest(new MissingParamError(field));
			}
		}
	}
}
