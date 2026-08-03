import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Booking} from "./booking";
import {Profile} from "./profile";

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Booking, (b) => b.messages, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'booking_id' })
    booking?: Booking;

    @ManyToOne(() => Profile, (p) => p.sentMessages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sender_id' })
    sender: Profile;

    @ManyToOne(() => Profile, (p) => p.receivedMessages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'receiver_id' })
    receiver: Profile;

    @Column('text')
    message: string;

    @Column({ default: false })
    is_read: boolean;

    @Column({ type: 'timestamp', nullable: true })
    read_at?: Date;

    @CreateDateColumn()
    created_at: Date;
}