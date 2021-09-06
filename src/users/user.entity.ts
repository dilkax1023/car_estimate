import { AfterInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert() // Entity listener
  logInsert() {
    console.log('Inserted a new user with an id ', this.id);
  }
}
