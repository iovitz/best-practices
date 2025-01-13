import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    comment: '邮箱',
    unique: true,
  })
  email: string

  @Column({
    type: 'varchar',
    comment: '密码',
  })
  password: string
}
