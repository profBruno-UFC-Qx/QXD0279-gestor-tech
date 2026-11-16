import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'

import { Project } from './Project'
import { User } from './User'

export enum ActivityPriority {
    BAIXA = 'BAIXA',
    MEDIA = 'MEDIA',
    ALTA = 'ALTA',
}

export enum ActivityStatus {
    A_FAZER = 'A_FAZER',
    EM_ANDAMENTO = 'EM_ANDAMENTO',
    CONCLUIDA = 'CONCLUIDA',
}

@Entity({ name: 'activities' })
@Index(['projetoId', 'responsavelId'])
export class Activity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: 'varchar', length: 160 })
    titulo!: string

    @Column({ type: 'text', default: '' })
    descricao!: string

    @Column({ type: 'text', enum: ActivityPriority, default: ActivityPriority.MEDIA })
    prioridade!: ActivityPriority

    @Column({ type: 'text', enum: ActivityStatus, default: ActivityStatus.A_FAZER })
    status!: ActivityStatus

    @Column({ type: 'date' })
    prazo!: string

    @Column({ type: 'integer' })
    projetoId!: number

    @ManyToOne(() => Project, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'projetoId' })
    projeto!: Project

    @Column({ type: 'integer', nullable: true })
    responsavelId!: number | null

    @ManyToOne(() => User, { nullable: true, onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'responsavelId' })
    responsavel!: User | null

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date
}
