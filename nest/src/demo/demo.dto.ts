import { ApiProperty } from '@nestjs/swagger'
import { IsNumberString, IsString, Length } from 'class-validator'
import { PaginationDto } from 'src/shared/dto/dto'

export class GetDemoParamsDTO {
  @ApiProperty({
    example: 1,
    description: 'Demo ID',
  })
  @IsNumberString()
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
  @IsNumberString()
  id: number
}

export class UpdateDemoParamsDTO {
  @ApiProperty({
    example: 1,
    description: 'Demo ID',
  })
  @IsNumberString()
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
