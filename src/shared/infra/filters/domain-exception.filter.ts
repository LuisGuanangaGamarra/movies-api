import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from '../../domain/exceptions/domain.exception';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.status ?? HttpStatus.BAD_REQUEST;

    const body = {
      success: false,
      code: exception.code,
      message: exception.message,
      context: exception.context ?? null,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(body);
  }
}
