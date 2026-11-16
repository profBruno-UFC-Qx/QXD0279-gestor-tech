import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'

export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: 'varchar', length: 120 })
    nome!: string

    @Column({ type: 'varchar', length: 180, unique: true })
    email!: string

    @Column({ type: 'varchar', length: 255, select: false })
    senhaHash!: string

    @Column({ type: 'text', enum: UserRole, default: UserRole.USER })
    role!: UserRole

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date
}
