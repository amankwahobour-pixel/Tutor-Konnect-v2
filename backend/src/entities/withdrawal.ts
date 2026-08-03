import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Profile} from "./profile";
import {MobileProvider} from "../enums/entity.enums";

@Entity('withdrawals')
export class Withdrawal {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Profile, (p) => p.withdrawals, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tutor_id' })
    tutor: Profile;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column()
    mobile_money_number: string;

    @Column({ type: 'enum', enum: MobileProvider })
    provider: MobileProvider;

    @Column({ type: 'varchar', default: 'pending' })
    status: 'pending' | 'processing' | 'processed' | 'failed';

    @Column({ type: 'timestamp', nullable: true })
    processed_at?: Date;

    @ManyToOne(() => Profile, { nullable: true })
    @JoinColumn({ name: 'processed_by' })
    processedBy?: Profile;

    @Column({ type: 'text', nullable: true })
    failure_reason?: string;

    @CreateDateColumn()
    created_at: Date;
}