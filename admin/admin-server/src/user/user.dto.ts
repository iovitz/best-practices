import { IsString, Matches } from 'class-validator';

export class getUserInfoDTO {
  @IsString()
  @Matches(/^\w{10}$/)
  id: string;
}
