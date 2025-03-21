import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, Version } from '@nestjs/common'
import { eq, gte } from 'drizzle-orm'
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { DRIZZLE_MYSQL, DRIZZLE_SQLITE } from 'src/database/drizzle/drizzle.module'
import { drizzleSqliteDemos } from 'src/database/drizzle/sqlite/model'
import { CreateDemoBodyDTO, DeleteDemoParamsDTO, GetDemoParamsDTO, GetDemosQueryDTO, UpdateDemoBodyDTO, UpdateDemoParamsDTO } from './demo.dto'
import { VerifyPipe } from 'src/aspects/pipes/verify/verify.pipe'
import { MySql2Database } from 'drizzle-orm/mysql2'
import { drizzleMysqlDemos } from 'src/database/drizzle/mysql/model'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeormMysqlDemo } from 'src/database/typeorm/mysql/demo.entity'
import { Repository } from 'typeorm'

@Controller('api/demo')
export class DemoController {
  // #region Drizzle SQLite
  @Inject(DRIZZLE_SQLITE)
  drizzleSqlite: BetterSQLite3Database

  @Get(':id')
  @Version('drizzle:sqlite')
  getDrizzleSqliteDemo(@Param(VerifyPipe) { id }: GetDemoParamsDTO) {
    return this.drizzleSqlite.select().from(drizzleSqliteDemos).where(eq(drizzleSqliteDemos.id, id))
  }

  @Get()
  @Version('drizzle:sqlite')
  getDrizzleSqliteDemos(@Param(VerifyPipe) { page, perPage }: GetDemosQueryDTO) {
    return this.drizzleSqlite.select({
      id: drizzleSqliteDemos.id,
      name: drizzleSqliteDemos.name,
    })
      .from(drizzleSqliteDemos)
      .where(gte(drizzleSqliteDemos.id, 0))
      .orderBy(drizzleSqliteDemos.id)
      .limit(perPage)
      .offset((page) * perPage)
      .execute()
  }

  @Post()
  @Version('drizzle:sqlite')
  crateDrizzleSqliteDemo(@Body(VerifyPipe) { name }: CreateDemoBodyDTO) {
    return this.drizzleSqlite.insert(drizzleSqliteDemos).values({ name }).execute()
  }

  @Patch(':id')
  @Version('drizzle:sqlite')
  updateDrizzleSqliteDemo(
    @Param(VerifyPipe) { id }: UpdateDemoParamsDTO,
    @Body(VerifyPipe){ name }: UpdateDemoBodyDTO,
  ) {
    return this.drizzleSqlite.update(drizzleSqliteDemos).set({
      name,
    }).where(eq(drizzleSqliteDemos.id, id))
  }

  @Delete(':id')
  @Version('drizzle:sqlite')
  deleteDrizzleSqliteDemo(@Param(VerifyPipe) { id }: DeleteDemoParamsDTO) {
    return this.drizzleSqlite.delete(drizzleSqliteDemos).where(eq(drizzleSqliteDemos.id, id))
  }
  // #endregion

  // #region Drizzle MySQL
  @Inject(DRIZZLE_MYSQL)
  drizzleMysql: MySql2Database

  @Get(':id')
  @Version('drizzle:mysql')
  getDrizzleMysqlDemo(@Param(VerifyPipe) { id }: GetDemoParamsDTO) {
    return this.drizzleMysql.select().from(drizzleMysqlDemos).where(eq(drizzleMysqlDemos.id, id))
  }

  @Get()
  @Version('drizzle:mysql')
  getDrizzleMysqlDemos(@Query(VerifyPipe) { page, perPage }: GetDemosQueryDTO) {
    return this.drizzleMysql.select({
      id: drizzleMysqlDemos.id,
      name: drizzleMysqlDemos.name,
    })
      .from(drizzleMysqlDemos)
      .where(gte(drizzleMysqlDemos.id, 0))
      .orderBy(drizzleMysqlDemos.id)
      .limit(perPage)
      .offset((page) * perPage)
      .execute()
  }

  @Post()
  @Version('drizzle:mysql')
  crateDrizzleMysqlDemo(@Body(VerifyPipe) { name }: CreateDemoBodyDTO) {
    return this.drizzleMysql.insert(drizzleMysqlDemos).values({ name }).execute()
  }

  @Patch(':id')
  @Version('drizzle:mysql')
  updateDrizzleMysqlDemo(
    @Param(VerifyPipe) { id }: UpdateDemoParamsDTO,
    @Body(VerifyPipe){ name }: UpdateDemoBodyDTO,
  ) {
    return this.drizzleMysql.update(drizzleMysqlDemos).set({
      name,
    }).where(eq(drizzleMysqlDemos.id, id))
  }

  @Delete(':id')
  @Version('drizzle:mysql')
  deleteDrizzleMysqlDemo(@Param(VerifyPipe) { id }: DeleteDemoParamsDTO) {
    return this.drizzleMysql.delete(drizzleMysqlDemos).where(eq(drizzleMysqlDemos.id, id))
  }
  // #endregion

  // #region Typeorm MySQL
  @InjectRepository(TypeormMysqlDemo)
  private typeormMysqlDemo: Repository<TypeormMysqlDemo>

  @Get(':id')
  @Version('typeorm:mysql')
  getTypeormMysqlDemo(@Param(VerifyPipe) { id }: GetDemoParamsDTO) {
  }

  @Get()
  @Version('typeorm:mysql')
  getTypeormMysqlDemos(@Query(VerifyPipe) { page, perPage }: GetDemosQueryDTO) {

  }

  @Post()
  @Version('typeorm:mysql')
  crateTypeormMysqlDemo(@Body(VerifyPipe) { name }: CreateDemoBodyDTO) {
  }

  @Patch(':id')
  @Version('typeorm:mysql')
  updateTypeormMysqlDemo(
    @Param(VerifyPipe) { id }: UpdateDemoParamsDTO,
    @Body(VerifyPipe){ name }: UpdateDemoBodyDTO,
  ) {

  }

  @Delete(':id')
  @Version('typeorm:mysql')
  deleteTypeormMysqlDemo(@Param(VerifyPipe) { id }: DeleteDemoParamsDTO) {

  }
  // #endregion
}
