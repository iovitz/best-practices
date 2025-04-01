import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, Version } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { eq, gte } from 'drizzle-orm'
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { MySql2Database } from 'drizzle-orm/mysql2'
import { VerifyPipe } from 'src/aspects/pipes/verify/verify.pipe'
import { DRIZZLE_MYSQL, DRIZZLE_SQLITE, PRISMA_MYSQL, PRISMA_SQLITE, PrismaMysqlClient, PrismaSqliteClient } from 'src/database/database.module'
import { drizzleMysqlDemos } from 'src/database/drizzle-mysql/model'
import { drizzleSqliteDemos } from 'src/database/drizzle-sqlite/model'
import { TypeormMysqlDemo } from 'src/database/typeorm-mysql/demo.entity'
import { TypeormSqliteDemo } from 'src/database/typeorm-sqlite/demo.entity'
import { Repository } from 'typeorm'
import { CreateDemoBodyDTO, DeleteDemoParamsDTO, GetDemoParamsDTO, GetDemosQueryDTO, UpdateDemoBodyDTO, UpdateDemoParamsDTO } from './demo.dto'

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
  getDrizzleSqliteDemos(@Query(VerifyPipe) { page, perPage }: GetDemosQueryDTO) {
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
  @InjectRepository(TypeormMysqlDemo, 'mysql')
  private typeormMysqlDemo: Repository<TypeormMysqlDemo>

  @Get(':id')
  @Version('typeorm:mysql')
  getTypeormMysqlDemo(@Param(VerifyPipe) { id }: GetDemoParamsDTO) {
    return this.typeormMysqlDemo.findOne({
      where: { id },
    })
  }

  @Get()
  @Version('typeorm:mysql')
  getTypeormMysqlDemos(@Query(VerifyPipe) { page, perPage }: GetDemosQueryDTO) {
    return this.typeormMysqlDemo.find({
      skip: page * perPage,
      take: perPage,
    })
  }

  @Post()
  @Version('typeorm:mysql')
  crateTypeormMysqlDemo(@Body(VerifyPipe) { name }: CreateDemoBodyDTO) {
    return this.typeormMysqlDemo.save({
      name,
    })
  }

  @Patch(':id')
  @Version('typeorm:mysql')
  updateTypeormMysqlDemo(
    @Param(VerifyPipe) { id }: UpdateDemoParamsDTO,
    @Body(VerifyPipe){ name }: UpdateDemoBodyDTO,
  ) {
    return this.typeormMysqlDemo.update({
      id,
    }, {
      name,
    })
  }

  @Delete(':id')
  @Version('typeorm:mysql')
  deleteTypeormMysqlDemo(@Param(VerifyPipe) { id }: DeleteDemoParamsDTO) {
    return this.typeormMysqlDemo.delete({
      id,
    })
  }
  // #endregion

  // #region Typeorm Sqlite
  @InjectRepository(TypeormSqliteDemo, 'sqlite')
  private typeormSqliteDemo: Repository<TypeormSqliteDemo>

  @Get(':id')
  @Version('typeorm:sqlite')
  getTypeormSqliteDemo(@Param(VerifyPipe) { id }: GetDemoParamsDTO) {
    return this.typeormSqliteDemo.findOne({
      where: { id },
    })
  }

  @Get()
  @Version('typeorm:sqlite')
  getTypeormSqliteDemos(@Query(VerifyPipe) { page, perPage }: GetDemosQueryDTO) {
    return this.typeormSqliteDemo.find({
      skip: page * perPage,
      take: perPage,
    })
  }

  @Post()
  @Version('typeorm:sqlite')
  crateTypeormSqliteDemo(@Body(VerifyPipe) { name }: CreateDemoBodyDTO) {
    return this.typeormSqliteDemo.save({
      name,
    })
  }

  @Patch(':id')
  @Version('typeorm:sqlite')
  updateTypeorSqliteDemo(
    @Param(VerifyPipe) { id }: UpdateDemoParamsDTO,
    @Body(VerifyPipe){ name }: UpdateDemoBodyDTO,
  ) {
    return this.typeormSqliteDemo.update({
      id,
    }, {
      name,
    })
  }

  @Delete(':id')
  @Version('typeorm:sqlite')
  deleteTypeormSqliteDemo(@Param(VerifyPipe) { id }: DeleteDemoParamsDTO) {
    return this.typeormSqliteDemo.delete({
      id,
    })
  }
  // #endregion

  // #region Prisma Mysql
  @Inject(PRISMA_MYSQL)
  private prismaMysql: PrismaMysqlClient

  @Get(':id')
  @Version('prisma:mysql')
  getPrismaMysqlDemo(@Param(VerifyPipe) { id }: GetDemoParamsDTO) {
    return this.prismaMysql.demo.findFirst({
      where: { id },
    })
  }

  @Get()
  @Version('prisma:mysql')
  getPrismaMysqlDemos(@Query(VerifyPipe) { page, perPage }: GetDemosQueryDTO) {
    return this.prismaMysql.demo.findMany({
      skip: page * perPage,
      take: perPage,
    })
  }

  @Post()
  @Version('prisma:mysql')
  cratePrismaMysqlDemo(@Body(VerifyPipe) { name }: CreateDemoBodyDTO) {
    return this.prismaMysql.demo.create({
      data: {
        name,
      },
    })
  }

  @Patch(':id')
  @Version('prisma:mysql')
  updatePrismaMysqlDemo(
    @Param(VerifyPipe) { id }: UpdateDemoParamsDTO,
    @Body(VerifyPipe){ name }: UpdateDemoBodyDTO,
  ) {
    return this.prismaMysql.demo.update({
      where: {
        id,
      },
      data: {
        name,
      },
    })
  }

  @Delete(':id')
  @Version('prisma:mysql')
  deletePrismaMysqlDemo(@Param(VerifyPipe) { id }: DeleteDemoParamsDTO) {
    return this.prismaMysql.demo.deleteMany({
      where: { id },
    })
  }

  // #endregion

  // #region Prisma Sqlite
  @Inject(PRISMA_SQLITE)
  private prismaSqlite: PrismaSqliteClient

  @Get(':id')
  @Version('prisma:sqlite')
  getPrismaSqliteDemo(@Param(VerifyPipe) { id }: GetDemoParamsDTO) {
    return this.prismaSqlite.demo.findFirst({
      where: { id },
    })
  }

  @Get()
  @Version('prisma:sqlite')
  getPrismaSqliteDemos(@Query(VerifyPipe) { page, perPage }: GetDemosQueryDTO) {
    return this.prismaSqlite.demo.findMany({
      skip: page * perPage,
      take: perPage,
    })
  }

  @Post()
  @Version('prisma:sqlite')
  cratePrismaSqliteDemo(@Body(VerifyPipe) { name }: CreateDemoBodyDTO) {
    return this.prismaSqlite.demo.create({
      data: {
        name,
      },
    })
  }

  @Patch(':id')
  @Version('prisma:sqlite')
  updatePrismaSqliteDemo(
    @Param(VerifyPipe) { id }: UpdateDemoParamsDTO,
    @Body(VerifyPipe){ name }: UpdateDemoBodyDTO,
  ) {
    return this.prismaSqlite.demo.update({
      where: {
        id,
      },
      data: {
        name,
      },
    })
  }

  @Delete(':id')
  @Version('prisma:sqlite')
  deletePrismaSqliteDemo(@Param(VerifyPipe) { id }: DeleteDemoParamsDTO) {
    return this.prismaSqlite.demo.deleteMany({
      where: { id },
    })
  }
  // #endregion
}
