import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne, OneToMany, OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Profile} from "./profile";
import {BookingStatus} from "../enums/entity.enums";
import {Payment} from "./payment";
import {Message} from "./message";
import {Review} from "./review";

@Entity('bookings')
export class Booking {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, nullable: true })
    booking_ref?: string;

    // RELATIONS (graph style)
    @ManyToOne(() => Profile, (p) => p.studentBookings, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'student_id' })
    student: Profile;

    @ManyToOne(() => Profile, (p) => p.tutorBookings, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tutor_id' })
    tutor: Profile;

    @Column()
    subject: string;

    @Column('timestamp')
    start_time: Date;

    @Column('timestamp')
    end_time: Date;

    @Column({ default: 1 })
    duration_hours: number;

    @Column('decimal', { precision: 10, scale: 2 })
    total_amount: number;

    @Column({ type: 'enum', enum: BookingStatus })
    status: BookingStatus;

    @Column({ nullable: true, type: 'text' })
    meet_link?: string;

    @Column({ type: 'timestamp', nullable: true })
    meet_link_generated_at?: Date;

    @Column({ type: 'timestamp', nullable: true })
    confirmed_at?: Date;

    @Column({ type: 'timestamp', nullable: true })
    tutor_response_at?: Date;

    @Column({ type: 'timestamp', nullable: true })
    cancelled_at?: Date;

    @Column({ type: 'text', nullable: true })
    cancellation_reason?: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // RELATIONS
    @OneToMany(() => Payment, (p) => p.booking)
    payments: Payment[];

    @OneToMany(() => Message, (m) => m.booking)
    messages: Message[];

    @OneToOne(() => Review, (r) => r.booking)
    review: Review;
}