import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length, Matches } from 'class-validator'
import { PagingDTO } from 'src/shared/dto/dto'

export class GetBookListDTO extends PagingDTO {}

export class GetBookDTO {
  @ApiProperty({
    example: 1,
    description: '图书ID',
  })
  @IsString()
  @Matches(/^\d+$/)
  id: string
}

export class CreateBookDTO {
  @ApiProperty({
    example: '理想国',
    description: '书籍名称',
  })
  @IsString()
  @Length(2, 20)
  name: string
}

export class GetBookResponseDTO {
  @ApiProperty({
    example: 1,
    description: '图书ID',
  })
  id: number

  @ApiProperty({
    example: '理想国',
    description: '图书名称',
  })
  name: string
}
