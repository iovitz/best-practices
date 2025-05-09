import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsInt, Max, Min } from 'class-validator'

export class PaginationDto {
  @ApiProperty({
    example: '1',
    description: '查看第几页的数据',
  })
  @Transform(({ value }) => Number.parseInt(value, 10)) // 转换为数字
  @IsInt() // 验证是否为整数
  @Min(0)
  page: number

  @ApiProperty({
    example: '10',
    description: '每页拉取的数据数量',
  })
  @Transform(({ value }) => Number.parseInt(value, 10)) // 转换为数字
  @IsInt() // 验证是否为整数
  @Min(1)
  @Max(5000)
  perPage: number
}
