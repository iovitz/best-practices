import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Tracer } from 'src/aspects/decorators/request'
import { VerifyPipe } from 'src/aspects/pipes/verify/verify.pipe'
import { TracerService } from 'src/util/tracer/tracer.service'
import { CreateBookDTO, GetBookDTO, GetBookListDTO, GetBookResponseDTO } from './book.dto'
import { BookService } from './book.service'

@ApiTags('图书')
@Controller('api/book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get()
  @ApiOperation({
    summary: '分页获取图书列表',
    description: '使用分页的方式获取图书列表',
  })
  @ApiResponse({
    status: 200,
    description: '分页筛选之后的图书列表',
    type: [GetBookResponseDTO],
  })
  async getBooks(@Query() query: GetBookListDTO, @Tracer() tracer: TracerService) {
    const books = await this.bookService.getBookList(
      Number(query.page),
      Number(query.per_page),
    )
    tracer.error('信息中携带Error', new Error('123123'))
    tracer.warn('打印警告')
    tracer.log('普通信息')
    return books
  }

  @Get('/:id')
  @ApiOperation({
    summary: '获取图书',
    description: '通过图书的ID获取图书',
  })
  @ApiResponse({
    status: 200,
    description: '注册成功的用户信息',
    type: GetBookResponseDTO,
  })
  async getBook(@Param(VerifyPipe) param: GetBookDTO) {
    const book = await this.bookService.getBookById(Number(param.id))
    return book
  }

  @ApiOperation({
    summary: '添加图书',
    description: '添加一条新的图书记录',
  })
  @ApiResponse({
    status: 200,
    description: '注册成功的用户信息',
    type: Boolean,
  })
  @Post()
  async createBook(@Body(VerifyPipe) body: CreateBookDTO) {
    const book = await this.bookService.createBook({
      name: body.name,
    })
    if (book.changes > 0) {
      return true
    }
    return false
  }
}
