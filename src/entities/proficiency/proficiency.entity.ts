import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../user/user.entity";
import { Curriculum } from "../course/course.entity";

export enum ProficiencyLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
}

export enum TechStack {
  BACKEND = "backend",
  FRONTEND = "frontend",
  QA = "qa",
  UI_UX = "ui/ux",
  DATA_SCIENCE = "data_science",
}

@Entity({ name: "proficiency_tests" })
export class ProficiencyTest {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  userId: string;

  @Column({ type: "int" })
  backendScore: number;

  @Column({ type: "int" })
  frontendScore: number;

  @Column({ type: "int" })
  qaScore: number;

  @Column({ type: "int" })
  uiUxScore: number;

  @Column({ type: "int" })
  dataScienceScore: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity({ name: "assigned_curriculums" })
export class AssignedCurriculum {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Curriculum, { onDelete: "CASCADE" })
  @JoinColumn({ name: "curriculumId" })
  curriculum: Curriculum;

  @Column()
  curriculumId: string;

  @Column({ type: "enum", enum: TechStack })
  techStack: TechStack;

  @Column()
  score: number;

  @Column({ type: "enum", enum: ProficiencyLevel })
  level: ProficiencyLevel;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}