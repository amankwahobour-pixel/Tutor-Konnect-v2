import { Profile } from "./profile";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn, OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {VerificationStatus} from "../enums/entity.enums";
import {TutorDocument} from "./tutor.document";
import {Review} from "./review";
import {Withdrawal} from "./withdrawal";

@Entity('tutor_profiles')
export class TutorProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => Profile, (p) => p.tutorProfile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: Profile;

    @Column({ type: 'text', nullable: true })
    bio?: string;

    @Column('text', { array: true, nullable: true })
    subjects?: string[];

    @Column('decimal', { precision: 10, scale: 2 })
    hourly_rate: number;

    @Column({ type: 'text', nullable: true })
    qualifications?: string;

    @Column({ type: 'enum', enum: VerificationStatus, default: VerificationStatus.PENDING })
    verification_status: VerificationStatus;

    @Column({ type: 'text', nullable: true })
    verification_rejection_reason?: string;

    @Column({ type: 'text', nullable: true })
    availability_notes?: string;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    total_earned: number;

    @Column('decimal', { precision: 3, scale: 2, default: 0 })
    rating_avg: number;

    @Column({ default: 0 })
    rating_count: number;

    @Column({ default: 0 })
    total_sessions: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // RELATIONS
    @OneToMany(() => TutorDocument, (d) => d.tutorProfile)
    documents: TutorDocument[];

    // @OneToMany(() => Verification, (v) => v.tutorProfile)
    // verifications: Verification[];

    @OneToMany(() => Review, (r) => r.tutor)
    reviews: Review[];

    @OneToMany(() => Withdrawal, (w) => w.tutor)
    withdrawalRequests: Withdrawal[];
}