import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map, Observable } from 'rxjs'

const DesensitizationDataFields = ['password']

@Injectable()
export class DesensitizeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if(data) {
          DesensitizationDataFields.forEach(d => delete data[d])
        }
        return data
      }),
    )
  }
}
