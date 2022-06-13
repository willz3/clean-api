import { MissingParamError } from "../../errors";
import { badRequest } from "../../helpers/http-helper";
import { HttpRequest, HttpResponse } from "../../protocols";
import { Controller } from "../../protocols/controller";

export class LoginController implements Controller {
	async handle(httpRquest: HttpRequest): Promise<HttpResponse> {
		return new Promise<HttpResponse>((resolve, reject) =>
			resolve(badRequest(new MissingParamError("email")))
		);
	}
}
