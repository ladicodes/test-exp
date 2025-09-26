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


export enum LessonType {
  LIVE_CLASS = "Live Class",
  VIRTUAL_WORKSHOP = "Virtual Workshop",
  VIRTUAL_CLASS = "Virtual Class",
  PRE_RECORDED = "Pre-recorded",
}

export enum CourseCategory {
  FRONTEND_DEVELOPMENT_BEGINNER = "Frontend Development - Beginner",
    FRONTEND_DEVELOPMENT_INTERMEDIATE = "Frontend Development - Intermediate",
    FRONTEND_DEVELOPMENT_ADVANCED = "Frontend Development - Advanced",
    BACKEND_DEVELOPMENT_BEGINNER = "Backend Development - Beginner",
    BACKEND_DEVELOPMENT_INTERMEDIATE = "Backend Development - Intermediate",
    BACKEND_DEVELOPMENT_ADVANCED = "Backend Development - Advanced",
    FULLSTACK_DEVELOPMENT_BEGINNER = "Fullstack Development - Beginner",
    FULLSTACK_DEVELOPMENT_INTERMEDIATE = "Fullstack Development - Intermediate",
    FULLSTACK_DEVELOPMENT_ADVANCED = "Fullstack Development - Advanced",
    UI_UX_DESIGN_BEGINNER = "UI/UX Design - Beginner",
    UI_UX_DESIGN_INTERMEDIATE = "UI/UX Design - Intermediate",
    UI_UX_DESIGN_ADVANCED = "UI/UX Design - Advanced",
    DATA_SCIENCE_BEGINNER = "Data Science - Beginner",
    DATA_SCIENCE_INTERMEDIATE = "Data Science - Intermediate",
    DATA_SCIENCE_ADVANCED = "Data Science - Advanced",
    MACHINE_LEARNING_BEGINNER = "Machine Learning - Beginner",
    MACHINE_LEARNING_INTERMEDIATE = "Machine Learning - Intermediate",
    MACHINE_LEARNING_ADVANCED = "Machine Learning - Advanced",
    CYBER_SECURITY_BEGINNER = "Cyber Security - Beginner",
    CYBER_SECURITY_INTERMEDIATE = "Cyber Security - Intermediate",
    CYBER_SECURITY_ADVANCED = "Cyber Security - Advanced",
    CLOUD_COMPUTING_BEGINNER = "Cloud Computing - Beginner",
    CLOUD_COMPUTING_INTERMEDIATE = "Cloud Computing - Intermediate",
    CLOUD_COMPUTING_ADVANCED = "Cloud Computing - Advanced",
    MOBILE_APP_DEVELOPMENT_BEGINNER = "Mobile App Development - Beginner",
    MOBILE_APP_DEVELOPMENT_INTERMEDIATE = "Mobile App Development - Intermediate",
    MOBILE_APP_DEVELOPMENT_ADVANCED = "Mobile App Development - Advanced",
    DEVOPS_BEGINNER = "DevOps - Beginner",
    DEVOPS_INTERMEDIATE = "DevOps - Intermediate",
    DEVOPS_ADVANCED = "DevOps - Advanced",

}

@Entity({ name: "courses" })
export class Course {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  title: string;

  @Column({ type: "timestamp" })
  startDate: Date;

  @Column({ type: "timestamp" })
  endDate: Date;


  @Column({ type: "text" })
  description: string;

  @Column({ nullable: true })
  videoUrl?: string;

  @Column({ nullable: true, enum: LessonType , type: "enum"})
  lessonType?: LessonType




  @ManyToOne(() => User, (user) => user.courses, { onDelete: "CASCADE" })
  instructor?: User;


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
