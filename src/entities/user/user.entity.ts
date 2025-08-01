import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from "typeorm";
import { Task } from "../tasks/task.entity";
import { Exclude } from "class-transformer";

export enum UserRole {
  ADMIN = "admin",
  STUDENT = "student",
  INSTRUCTOR = "instructor",
}

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  address: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @Column({ unique: true })
  email: string;

  @Column()
  school: string;

  @Column({ nullable: true })
  profilePicture?: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ nullable: true })
  github?: string;

  @Column({ nullable: true })
  linkedin?: string;

  @Column({ nullable: true })
  twitter?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  dateOfBirth?: Date;

  @Column({ default: false })
  isVerified: boolean;

  @Column()
  password: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  // Tasks assigned TO this user
  @OneToMany(() => Task, (task) => task.assignedTo)
  assignedTasks: Task[];

  // Tasks this user assigned TO others
  @OneToMany(() => Task, (task) => task.assignedBy)
  createdTasks: Task[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
