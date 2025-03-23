import {
  ArgumentMetadata,
  BadRequestException,

  Injectable,

  PipeTransform,
} from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'

@Injectable()
export class VerifyPipe implements PipeTransform {
  async transform(_value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata
    const value = plainToClass(metatype, _value)
    const errors = await validate(value, {
      whitelist: true,
      forbidNonWhitelisted: true,
    })

    if (errors.length > 0) {
      const errorMessages = this.buildErrorMessage(errors)
      throw new BadRequestException(errorMessages)
    }

    return value
  }

  private buildErrorMessage(errors: ValidationError[]): string[] {
    return errors
      .map((error) => {
        if (error.constraints) {
          return Object.values(error.constraints).join(', ')
        }
        else if (error.children) {
          return this.buildErrorMessage(error.children)
        }
        return ''
      })
      .flat()
  }
}
