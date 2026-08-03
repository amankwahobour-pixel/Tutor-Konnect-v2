import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Booking} from "./booking";
import {MobileProvider, PaymentStatus} from "../enums/entity.enums";

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Booking, (b) => b.payments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'booking_id' })
    booking: Booking;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({ nullable: true })
    mobile_money_number?: string;

    @Column({ type: 'enum', enum: MobileProvider, nullable: true })
    provider?: MobileProvider;

    @Column({ type: 'enum', enum: PaymentStatus })
    payment_status: PaymentStatus;

    @Column({ unique: true, nullable: true })
    transaction_reference?: string;

    @Column({ nullable: true })
    paystack_reference?: string;

    @Column({ nullable: true })
    paystack_access_code?: string;

    @Column({ type: 'timestamp', nullable: true })
    paid_at?: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}