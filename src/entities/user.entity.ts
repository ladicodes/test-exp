import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

enum UserRole {
  ADMIN = "admin",
  USER = "user",
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

  @Column()
  address: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
