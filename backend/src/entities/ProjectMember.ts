import {
    CreateDateColumn,
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'

import { Project } from './Project'
import { User } from './User'

@Entity({ name: 'project_members' })
@Index(['projetoId', 'usuarioId'], { unique: true })
export class ProjectMember {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: 'integer' })
    projetoId!: number

    @ManyToOne(() => Project, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'projetoId' })
    projeto!: Project

    @Column({ type: 'integer' })
    usuarioId!: number

    @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'usuarioId' })
    usuario!: User

    @CreateDateColumn()
    createdAt!: Date
}
