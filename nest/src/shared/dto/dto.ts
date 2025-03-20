import { ApiProperty } from '@nestjs/swagger'
import { IsNumberString } from 'class-validator'
import {
  NumberStringMax,
  NumberStringMin,
} from '../validator/string-number.validator'

export class PaginationDto {
  @ApiProperty({
    example: '1',
    description: '查看第几页的数据',
  })
  @IsNumberString({
    no_symbols: true,
  })
  @NumberStringMin(0)
  page: string

  @ApiProperty({
    example: '10',
    description: '每页拉取的数据数量',
  })
  @IsNumberString({
    no_symbols: true,
  })
  @NumberStringMin(0)
  @NumberStringMax(5000)
  perPage: string
}
