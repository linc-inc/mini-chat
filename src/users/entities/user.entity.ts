import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({
    select: false, // Hide the password when querying users
  })
  password: string;

  @Column()
  fullName: string;

  @BeforeInsert()
  checkEmailBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkEmailBeforeUpdate() {
    this.checkEmailBeforeInsert();
  }
}
