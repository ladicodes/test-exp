import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
