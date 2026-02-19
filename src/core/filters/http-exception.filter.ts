import {ArgumentsHost, Catch, ExceptionFilter, HttpException, NotFoundException} from "@nestjs/common";
import {Request, Response} from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): any {
    if (exception instanceof NotFoundException) {
      console.log("Caught not found", exception.cause);
    } else {
      console.log("Caught an error", exception.cause);
    }

    let res = host.switchToHttp().getResponse<Response>();
    let req = host.switchToHttp().getRequest<Request>();

    let code = exception.getStatus();

    return res.status(code).json(exception.getResponse());
  }
}
