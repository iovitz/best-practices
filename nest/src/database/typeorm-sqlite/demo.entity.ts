import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('typeorm-demos')
export class TypeormSqliteDemo {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    comment: 'Demo name',
    length: 20,
  })
  name: string
}
