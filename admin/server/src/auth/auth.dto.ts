import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';

class AuthBaseDTO {
  @IsEmail()
  @Length(6, 30)
  email: string;

  @IsString()
  @Length(6, 16)
  @Matches(/^\S+$/)
  password: string;
}

export class LoginDTO extends AuthBaseDTO {
  @IsString()
  @Length(4, 4)
  @Matches(/^\S+$/)
  code: string;
}

export class CreateUserDTO extends AuthBaseDTO {
  @IsString()
  @Length(2, 10)
  username: string;

  @IsString()
  @Length(1, 50)
  @IsOptional()
  homepath: string;
}

export class GetCodeDTO {
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  @Min(0)
  @Max(500)
  width: number;

  @IsInt()
  @Transform(({ value }) => parseInt(value))
  @Min(0)
  @Max(500)
  height: number;

  @IsIn(['login'])
  type: string;

  @IsString()
  @Matches(/^#[a-fA-F0-9]{6}$/)
  background?: string;
}
