import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsInt, IsString, Length, Min } from 'class-validator'
import { PaginationDto } from 'src/shared/dto/dto'

export class GetDemoParamsDTO {
  @ApiProperty({
    example: 1,
    description: 'Demo ID',
  })
  @Transform(({ value }) => Number.parseInt(value, 10)) // 转换为数字
  @IsInt() // 验证是否为整数
  @Min(1)
  id: number
}

export class GetDemosQueryDTO extends PaginationDto {}

export class CreateDemoBodyDTO {
  @ApiProperty({
    example: 'demo1',
    description: 'Demo name',
  })
  @IsString()
  @Length(2, 20)
  name: string
}

export class DeleteDemoParamsDTO {
  @ApiProperty({
    example: 1,
    description: 'Demo ID',
  })
  @Transform(({ value }) => Number.parseInt(value, 10)) // 转换为数字
  @IsInt() // 验证是否为整数
  @Min(1)
  id: number
}

export class UpdateDemoParamsDTO {
  @ApiProperty({
    example: 1,
    description: 'Demo ID',
  })
  @Transform(({ value }) => Number.parseInt(value, 10)) // 转换为数字
  @IsInt() // 验证是否为整数
  @Min(1)
  id: number
}

export class UpdateDemoBodyDTO {
  @ApiProperty({
    example: 'demo1',
    description: 'Demo name',
  })
  @IsString()
  @Length(2, 20)
  name: string
}
