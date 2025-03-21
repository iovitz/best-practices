import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('demos')
export class TypeormMysqlDemo {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    comment: 'Demo name',
    length: 20,
  })
  name: string
}
