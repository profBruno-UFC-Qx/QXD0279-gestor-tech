import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'

import { User } from './User'

export enum ProjectStatus {
    PLANEJADO = 'PLANEJADO',
    EM_ANDAMENTO = 'EM_ANDAMENTO',
    CONCLUIDO = 'CONCLUIDO',
}

@Entity({ name: 'projects' })
export class Project {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: 'varchar', length: 120 })
    nome!: string

    @Column({ type: 'text', default: '' })
    descricao!: string

    @Column({ type: 'date' })
    dataInicio!: string

    @Column({ type: 'date' })
    dataFim!: string

    @Column({ type: 'text', enum: ProjectStatus, default: ProjectStatus.PLANEJADO })
    status!: ProjectStatus

    @Column({ type: 'integer' })
    gerenteId!: number

    @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'gerenteId' })
    gerente!: User

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date
}
