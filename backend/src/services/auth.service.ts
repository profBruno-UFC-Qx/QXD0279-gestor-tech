import { hash, compare } from 'bcryptjs'
import jwt, { type SignOptions } from 'jsonwebtoken'

import { env } from '../config/env'
import { AppDataSource } from '../database/data-source'
import { User, UserRole } from '../entities/User'
import { AppError } from '../errors/AppError'

export interface RegisterInput {
    nome: string
    email: string
    senha: string
}

export interface LoginInput {
    email: string
    senha: string
}

export interface PublicUser {
    id: number
    nome: string
    email: string
    role: UserRole
}

export interface AuthResponse {
    token: string
    user: PublicUser
}

function userRepository() {
    return AppDataSource.getRepository(User)
}

function normalizeEmail(email: string): string {
    return email.trim().toLowerCase()
}

function toPublicUser(user: User): PublicUser {
    return {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
    }
}

function createToken(user: User): string {
    const options: SignOptions = {
        subject: String(user.id),
        expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'],
    }

    return jwt.sign({ role: user.role }, env.jwtSecret, options)
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
    const repository = userRepository()
    const email = normalizeEmail(input.email)
    const existingUser = await repository.findOne({ where: { email } })

    if (existingUser) throw new AppError('Já existe uma conta com este e-mail.', 409)

    const user = repository.create({
        nome: input.nome.trim(),
        email,
        senhaHash: await hash(input.senha, 12),
        role: UserRole.USER,
    })

    await repository.save(user)

    return {
        token: createToken(user),
        user: toPublicUser(user),
    }
}

export async function login(input: LoginInput): Promise<AuthResponse> {
    const email = normalizeEmail(input.email)
    const user = await userRepository()
        .createQueryBuilder('user')
        .addSelect('user.senhaHash')
        .where('LOWER(user.email) = :email', { email })
        .getOne()

    if (!user || !(await compare(input.senha, user.senhaHash))) {
        throw new AppError('E-mail ou senha inválidos.', 401)
    }

    return {
        token: createToken(user),
        user: toPublicUser(user),
    }
}

export async function getCurrentUser(userId: number): Promise<PublicUser> {
    const user = await userRepository().findOne({ where: { id: userId } })
    if (!user) throw new AppError('Usuário não encontrado.', 401)
    return toPublicUser(user)
}

export async function seedAdminFromEnvironment(): Promise<boolean> {
    const { name, email, password } = env.admin
    if (!name || !email || !password) return false
    if (password.length < 8) {
        throw new Error('ADMIN_PASSWORD deve possuir pelo menos 8 caracteres.')
    }

    const repository = userRepository()
    const existingUser = await repository.findOne({ where: { email } })

    if (existingUser) {
        if (existingUser.role !== UserRole.ADMIN) {
            existingUser.role = UserRole.ADMIN
            await repository.save(existingUser)
        }
        return false
    }

    const admin = repository.create({
        nome: name,
        email,
        senhaHash: await hash(password, 12),
        role: UserRole.ADMIN,
    })
    await repository.save(admin)
    return true
}
