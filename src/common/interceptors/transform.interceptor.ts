// src/common/interceptors/transform.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: string[] | null;
  meta: {
    timestamp: string;
    method: string;
  };
}
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const succcessStatus = true;

    return next.handle().pipe(
      map((response: any) => {
        console.log('--- START TRANSFORMATION INTERCEPTOR ---');
        let method = request.method,
          data,
          message,
          meta;
        console.log('Reuquest', method);
        switch (method) {
          case 'GET':
            data = response?.data?.data ?? response?.data;
            message = response?.message;
            meta = response?.data?.meta;

            break;
          case 'POST':
          case 'PUT':
          case 'PATCH':
            data = response?.data;
            message = response?.message;
            break;
          case 'DELETE':
            data = response?.data;
            message = response?.message;
            break;
          default:
            break;
        }
        return {
          success: succcessStatus,
          data: data,
          message: message,
          errors: null,
          meta: meta ?? {
            timestamp: new Date().toISOString(),
            method: request.method,
          },
        };
      }),
    );
  }
}
