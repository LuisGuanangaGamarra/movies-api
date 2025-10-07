import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Response } from 'express';

import { DomainException } from '../../domain/exceptions/domain.exception';

interface ErrorResponse {
  success: false;
  code: string;
  message: string;
  context: unknown;
  timestamp: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    const { status, body } = this.mapToHttpResponse(exception);
    response.status(status).json(body);
  }

  private mapToHttpResponse(exception: unknown): {
    status: number;
    body: ErrorResponse;
  } {
    const timestamp = new Date().toISOString();

    const build = (
      code: string,
      message: string,
      status: number,
      context: unknown = null,
    ): { status: number; body: ErrorResponse } => ({
      status,
      body: { success: false, code, message, context, timestamp },
    });

    type ExceptionHandler = () => { status: number; body: ErrorResponse };

    const resolvers = new Map<
      new (...args: any[]) => unknown,
      ExceptionHandler
    >([
      [
        DomainException,
        () => {
          const e = exception as DomainException;
          return build(
            e.code,
            e.message,
            e.status ?? HttpStatus.BAD_REQUEST,
            e.context,
          );
        },
      ],
      [
        HttpException,
        () => {
          const e = exception as HttpException;
          const response = e.getResponse();

          const payload =
            typeof response === 'string'
              ? { message: response }
              : (response as Record<string, unknown>);

          const code = (payload['error'] as string) ?? 'HTTP_ERROR';
          const message =
            (payload['message'] as string) ??
            e.message ??
            'Unexpected HTTP error';

          return build(code, message, e.getStatus());
        },
      ],
      [
        Error,
        () => {
          const e = exception as Error;
          return build(
            'INTERNAL_ERROR',
            e.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        },
      ],
    ]);

    for (const [type, handler] of resolvers) {
      if (exception instanceof type) return handler();
    }

    return build(
      'UNKNOWN_ERROR',
      'Unexpected error occurred',
      HttpStatus.INTERNAL_SERVER_ERROR,
      exception,
    );
  }
}
