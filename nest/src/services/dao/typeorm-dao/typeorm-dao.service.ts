import { TwitterSnowflake } from '@sapphire/snowflake'
import { Repository } from 'typeorm'

interface EntityWithID {
  id: string | number
}

export abstract class TypeormDAOService<T extends EntityWithID> {
  abstract entity: Repository<T>
  getSnowflakeID() {
    return TwitterSnowflake.generate().toString()
  }

  create(...args: Parameters< Repository<T>['create']>) {
    return this.entity.create(...args)
  }

  insert(...args: Parameters< Repository<T>['insert']>) {
    return this.entity.insert(...args)
  }

  save(...args: Parameters< Repository<T>['save']>) {
    return this.entity.save(...args)
  }

  update(...args: Parameters< Repository<T>['update']>) {
    return this.entity.update(...args)
  }

  delete(...args: Parameters< Repository<T>['delete']>) {
    return this.entity.delete(...args)
  }

  findOne(...args: Parameters< Repository<T>['findOne']>) {
    return this.entity.findOne(...args)
  }

  findOneBy(...args: Parameters< Repository<T>['findOneBy']>) {
    return this.entity.findOneBy(...args)
  }

  find(...args: Parameters< Repository<T>['find']>) {
    return this.entity.find(...args)
  }

  findBy(...args: Parameters< Repository<T>['findBy']>) {
    return this.entity.findBy(...args)
  }

  count(...args: Parameters< Repository<T>['count']>) {
    return this.entity.count(...args)
  }

  countBy(...args: Parameters< Repository<T>['countBy']>) {
    return this.entity.countBy(...args)
  }
}
