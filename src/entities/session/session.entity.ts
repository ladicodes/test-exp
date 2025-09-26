import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../user/user.entity";

export enum SessionCategory {
  API_BUILDING = "API Building",
  UI_UX_DESIGN = "UI/UX Design",
  DESIGN_WORKSHOP = "Design Workshop",
  FRONTEND_DEVELOPMENT = "Frontend Development",
  BACKEND_DEVELOPMENT = "Backend Development",
  FULLSTACK_DEVELOPMENT = "Fullstack Development",
  DEVOPS = "DevOps",
  DATABASE_MANAGEMENT = "Database Management",
  DATA_SCIENCE = "Data Science",
  MACHINE_LEARNING = "Machine Learning",
  CYBER_SECURITY = "Cyber Security",
  CLOUD_COMPUTING = "Cloud Computing",
  MOBILE_APP_DEVELOPMENT = "Mobile App Development",
  GAME_DEVELOPMENT = "Game Development",
  BLOCKCHAIN_TECHNOLOGY = "Blockchain Technology",
  SOFTWARE_TESTING = "Software Testing",
  IOT = "IoT",
  NETWORKING = "Networking",
  AGILE_METHODOLOGIES = "Agile Methodologies",
}

@Entity({ name: "sessions" })
export class Session {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column({
    type: "enum",
    enum: SessionCategory,
  })
  category: SessionCategory;

  @Column({ type: "timestamp" })
  startTime: Date;

  @Column({ type: "timestamp", nullable: true })
  endTime: Date;

  @Column({ type: "text", nullable: true })
  description?: string;

  @ManyToOne(() => User, (user) => user.sessions, { onDelete: "CASCADE" })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
