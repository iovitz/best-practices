import { IsInt, IsString, Length, Matches, Max, Min } from 'class-validator';
import { PagingDTO } from 'src/shared/dto/dto';

export class getUserInfoDTO {
  @IsString()
  @Matches(/^\d+$/)
  id: string;
}

export class createUserDTO {
  @IsString()
  @Length(2, 20)
  name: string;

  @IsInt()
  @Min(1)
  @Max(150)
  age: number;
}
