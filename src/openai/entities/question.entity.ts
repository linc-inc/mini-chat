import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    user: number;

    @Column()
    question: string;

    @Column()
    answer: string;
}