import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Version } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { DRIZZLE_MYSQL, DRIZZLE_SQLITE } from 'src/database/drizzle/drizzle.module'
import { drizzleSqliteDemos } from 'src/database/drizzle/sqlite.model'
import { CreateDemoBodyDTO, DeleteDemoParamsDTO, GetDemoParamsDTO, GetDemosParamsDTO, UpdateDemoBodyDTO, UpdateDemoParamsDTO } from './demo.dto'
import { VerifyPipe } from 'src/aspects/pipes/verify/verify.pipe'
import { MySql2Database } from 'drizzle-orm/mysql2'
import { mysqlDemos } from 'src/database/drizzle/mysql.model'

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
  getDrizzleSqliteDemos(@Param(VerifyPipe) { page, perPage }: GetDemosParamsDTO) {
    return this.drizzleSqlite.select({
      id: drizzleSqliteDemos.id,
      name: drizzleSqliteDemos.name,
    })
      .from(drizzleSqliteDemos)
      .limit(Number(page))
      .offset((Number(page) - 1) * Number(perPage))
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
  @Version('drizzle:sqlite')
  getDrizzleMysqlDemo(@Param(VerifyPipe) { id }: GetDemoParamsDTO) {
    return this.drizzleMysql.select().from(mysqlDemos).where(eq(mysqlDemos.id, id))
  }

  @Get()
  @Version('drizzle:sqlite')
  getDrizzleMysqlDemos(@Param(VerifyPipe) { page, perPage }: GetDemosParamsDTO) {
    return this.drizzleMysql.select({
      id: mysqlDemos.id,
      name: mysqlDemos.name,
    })
      .from(mysqlDemos)
      .limit(Number(page))
      .offset((Number(page) - 1) * Number(perPage))
  }

  @Post()
  @Version('drizzle:sqlite')
  crateDrizzleMysqlDemo(@Body(VerifyPipe) { name }: CreateDemoBodyDTO) {
    return this.drizzleMysql.insert(mysqlDemos).values({ name }).execute()
  }

  @Patch(':id')
  @Version('drizzle:sqlite')
  updateDrizzleMysqlDemo(
    @Param(VerifyPipe) { id }: UpdateDemoParamsDTO,
    @Body(VerifyPipe){ name }: UpdateDemoBodyDTO,
  ) {
    return this.drizzleMysql.update(mysqlDemos).set({
      name,
    }).where(eq(mysqlDemos.id, id))
  }

  @Delete(':id')
  @Version('drizzle:sqlite')
  deleteDrizzleMysqlDemo(@Param(VerifyPipe) { id }: DeleteDemoParamsDTO) {
    return this.drizzleMysql.delete(mysqlDemos).where(eq(mysqlDemos.id, id))
  }
  // #endregion
}
