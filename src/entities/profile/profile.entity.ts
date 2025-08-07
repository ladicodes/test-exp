import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: "profiles" })
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  avatar: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  matric_number: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  university: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  year: string;

  @Column("text", { array: true, nullable: true })
  skills: string[];

  @Column({ nullable: true })
  main_stack: string;

  @Column("text", { array: true, nullable: true })
  stacks: string[];

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  activity_done: string;

  @Column({ nullable: true })
  mentorship_sessions_attended: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
