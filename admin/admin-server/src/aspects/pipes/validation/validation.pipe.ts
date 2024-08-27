import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    const object = plainToClass(metatype, value);
    const errors = await validate(object, {
      skipMissingProperties: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const errorMessages = this.buildErrorMessage(errors);
      throw new UnprocessableEntityException(errorMessages);
    }
    return value;
  }

  private buildErrorMessage(errors: ValidationError[]): string[] {
    return errors
      .map((error) => {
        if (error.constraints) {
          return Object.values(error.constraints).join(', ');
        } else if (error.children) {
          return this.buildErrorMessage(error.children);
        }
      })
      .flat();
  }
}
