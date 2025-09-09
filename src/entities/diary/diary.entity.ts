import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../user/user.entity";

@Entity({ name: "diaries" })
export class Diary {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  whatWorkOn: string;

  @Column()
  whatLearned: string;

  @Column()
  whatCouldBeBetter: string;

  @Column()
  howItFeels: string;

  @Column()
  goalsForNextTime: string;

  @ManyToOne(() => User, { nullable: true })
  user?: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
