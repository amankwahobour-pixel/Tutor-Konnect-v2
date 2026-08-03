import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Booking} from "./booking";
import {Profile} from "./profile";

@Entity('reviews')
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => Booking, (b) => b.review, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'booking_id' })
    booking: Booking;

    @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'student_id' })
    student: Profile;

    @ManyToOne(() => Profile, (p) => p.tutorBookings, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tutor_id' })
    tutor: Profile;

    @Column('int')
    rating: number;

    @Column({ type: 'text', nullable: true })
    review_text?: string;

    @CreateDateColumn()
    created_at: Date;
}