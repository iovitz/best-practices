import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @Length(6, 30)
  email: string;

  @IsEmail()
  @Length(6, 16)
  password: string;

  @IsString()
  @Length(2, 10)
  realName: string;

  @IsString()
  @Length(1, 50)
  @IsOptional()
  homepath: string;
}
