import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from 'typeorm';
import type {User} from './user.entity';
import type {Task} from './task.entity';
import type {FileEntity} from './file.entity';
import {SubmissionStatus} from '../../../core/enums/submission-status.enum';
import {BaseModel} from '../../../core/base-model';

@Entity('submissions')
export class Submission extends BaseModel {
    @Column()
    studentId: number;

    @ManyToOne('User', {onDelete: 'CASCADE'})
    @JoinColumn({name: 'studentId'})
    student: User;

    @Column()
    taskId: number;

    @ManyToOne('Task', {onDelete: 'CASCADE'})
    @JoinColumn({name: 'taskId'})
    task: Task;

    @Column({type: 'text', nullable: true})
    content?: string;

    @Column({type: 'int', nullable: true})
    mark?: number;

    @Column({type: 'text', nullable: true})
    feedback?: string;

    @Column({
        type: 'enum',
        enum: SubmissionStatus,
        enumName: 'submission_status_enum',
        default: SubmissionStatus.pending,
    })
    status: SubmissionStatus;

    @OneToMany('FileEntity', 'submission')
    files: FileEntity[];
}
