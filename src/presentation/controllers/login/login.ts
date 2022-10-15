import { Authentication } from "../../../domain/usecases/authentication";
import { MissingParamError } from "../../errors";
import { badRequest, ok, serverError, unauthorized } from "../../helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";


export class LoginController implements Controller {
  private readonly authentication: Authentication;

  constructor(authentication: Authentication) {
    this.authentication = authentication;
  }
  
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'));
    }

    if (!httpRequest.body.password) {
      return badRequest(new MissingParamError('password'));
    }

    const { email, password } = httpRequest.body;

    const token = await this.authentication.auth({email, password});

    if (!token) {
      return unauthorized();
    }
    
    return ok(token);
    } catch(error) {
      return serverError();
    }
  }
}