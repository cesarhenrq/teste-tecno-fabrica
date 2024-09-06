import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { StatusEnum } from 'src/enums/status.enum';

@Entity({
  name: 'tasks',
})
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  description: string;

  @Column({
    type: 'enum',
    nullable: false,
    enum: StatusEnum,
    default: StatusEnum.PENDING,
  })
  status: StatusEnum;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;
}
