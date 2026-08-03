import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn
} from "typeorm";
import {Booking} from "./booking";
import {Message} from "./message";
import {UserRole} from "../enums/entity.enums";
import {TutorProfile} from "./tutor.profile";
import {Withdrawal} from "./withdrawal";

@Entity('profiles')
export class Profile {
    @PrimaryColumn('uuid')
    id: string;

    @Column({ unique: true })
    phone_number: string;

    @Column({ type: 'enum', enum: UserRole })
    role: UserRole;

    @Column({ nullable: true })
    full_name?: string;

    @Column({ nullable: true, type: 'text' })
    profile_photo?: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // RELATIONS
    @OneToOne(() => TutorProfile, (t) => t.user)
    tutorProfile?: TutorProfile;

    @OneToMany(() => Booking, (b) => b.student)
    studentBookings?: Booking[];

    @OneToMany(() => Booking, (b) => b.tutor)
    tutorBookings?: Booking[];

    @OneToMany(() => Message, (m) => m.sender)
    sentMessages?: Message[];

    @OneToMany(() => Message, (m) => m.receiver)
    receivedMessages?: Message[];

    @OneToMany(() => Withdrawal, (w) => w.tutor)
    withdrawals?: Withdrawal[];
}