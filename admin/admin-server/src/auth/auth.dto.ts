import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
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

export class LoginDTO extends AuthBaseDTO {}

export class CreateUserDto extends AuthBaseDTO {
  @IsString()
  @Length(2, 10)
  realName: string;

  @IsString()
  @Length(1, 50)
  @IsOptional()
  homepath: string;
}
