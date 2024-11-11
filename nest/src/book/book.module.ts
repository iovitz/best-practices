import { Module } from '@nestjs/common'
import { SqliteModule } from 'src/sqlite/sqlite.module'
import { BookController } from './book.controller'
import { BookService } from './book.service'

@Module({
  imports: [SqliteModule],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
