import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {TutorProfile} from "./tutor.profile";

@Entity('tutor_documents')
export class TutorDocument {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => TutorProfile, (t) => t.documents, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tutor_id' })
    tutorProfile: TutorProfile;

    @Column()
    document_type: string;

    @Column('text')
    file_url: string;

    @Column({ nullable: true })
    file_name?: string;

    @Column({ type: 'int', nullable: true })
    file_size?: number;

    @Column({ nullable: true })
    mime_type?: string;

    @CreateDateColumn()
    uploaded_at: Date;
}