import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsNumberString, Max, Min } from 'class-validator'
import {
  NumberStringMax,
  NumberStringMin,
} from '../validator/string-number.validator'
import { Transform } from 'class-transformer'

export class PaginationDto {
  @ApiProperty({
    example: '1',
    description: '查看第几页的数据',
  })
  @Transform(({ value }) => Number.parseInt(value))
  @IsNumber()
  @Min(0)
  page: number

  @ApiProperty({
    example: '10',
    description: '每页拉取的数据数量',
  })
  @Transform(({ value }) => Number.parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(5000)
  perPage: number
}
