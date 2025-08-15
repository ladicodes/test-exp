import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Course } from "./course.entity";

@Entity({ name: "lessons" })
export class Lesson {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column({ type: "text" })
  content: string;

  @Column({ nullable: true })
  videoUrl?: string;

  @Column({ default: 0 })
  order: number;

  @ManyToOne(() => Course, (course) => course.lessons, { onDelete: "CASCADE" })
  course: Course;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
