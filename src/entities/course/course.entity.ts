import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "../user/user.entity";


export enum LessonType {
  LIVE_CLASS = "Live Class",
  VIRTUAL_WORKSHOP = "Virtual Workshop",
  VIRTUAL_CLASS = "Virtual Class",
  PRE_RECORDED = "Pre-recorded",
}

export enum CurriculumTitle {
  FRONTEND_DEVELOPMENT_BEGINNER = "Frontend Development - Beginner",
  FRONTEND_DEVELOPMENT_INTERMEDIATE = "Frontend Development - Intermediate",
  BACKEND_DEVELOPMENT_BEGINNER = "Backend Development - Beginner",
  BACKEND_DEVELOPMENT_INTERMEDIATE = "Backend Development - Intermediate",
  UI_UX_DESIGN_BEGINNER = "UI/UX Design - Beginner",
  UI_UX_DESIGN_INTERMEDIATE = "UI/UX Design - Intermediate",
  CYBER_SECURITY_BEGINNER = "Cyber Security - Beginner",
  CYBER_SECURITY_INTERMEDIATE = "Cyber Security - Intermediate",
  QA_BEGINNER = "QA - Beginner",
    QA_INTERMEDIATE = "QA - Intermediate",
    DATA_SCIENCE_BEGINNER = "Data Science - Beginner",
    DATA_SCIENCE_INTERMEDIATE = "Data Science - Intermediate",

}

@Entity({ name: "curriculums" })
export class Curriculum {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "enum", enum: CurriculumTitle })
  title: CurriculumTitle;

  @Column({ type: "text" })
  description: string;

  @OneToMany(() => Course, (course) => course.curriculum)
  courses: Course[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity({ name: "courses" })
export class
Course {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column({ type: "timestamp" })
  endDate: Date;

  @Column({ type: "text" })
  description: string;

  @Column({ nullable: true })
  videoUrl?: string;

  @Column({ type: "enum", enum: LessonType })
  lessonType: LessonType;

  @ManyToOne(() => User, (user) => user.courses, { nullable: true, onDelete: "SET NULL" })
  instructor?: User;

  @ManyToOne(() => Curriculum, (curriculum) => curriculum.courses, { onDelete: "CASCADE" })
  curriculum: Curriculum;


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
