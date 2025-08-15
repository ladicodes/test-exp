import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Lesson } from "./lesson.entity";
import { User } from "../user/user.entity";

@Entity({ name: "courses" })
export class Course {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({ nullable: true })
  thumbnailUrl?: string;

  @Column({ default: "draft" })
  status: "draft" | "published";

  @ManyToOne(() => User, (user) => user.courses, { onDelete: "CASCADE" })
  instructor: User;

  @OneToMany(() => Lesson, (lesson) => lesson.course, { cascade: true })
  lessons: Lesson[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
