import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const error = exception.getResponse() as
      | string
      | { error: string; statusCode: number; Message: string | string[] };

    if (typeof error === 'string') {
      // 커스텀한 에러는 스트링으로 반환됨
      response.status(status).json({
        success: false,
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        error,
      });
    } else {
      // 네스트 자체에서 발생시킨 에러는 오브젝트형식임
      response.status(status).json({
        success: false,
        timestamp: new Date().toISOString(),
        ...error,
      });
    }
  }
}
