const assert = require('node:assert/strict')
const { after, before, test } = require('node:test')
const { mkdtempSync, rmSync } = require('node:fs')
const { tmpdir } = require('node:os')
const { join } = require('node:path')

const testDirectory = mkdtempSync(join(tmpdir(), 'gestor-tech-test-'))
process.env.NODE_ENV = 'test'
process.env.DATABASE_PATH = join(testDirectory, 'integration.sqlite')
process.env.DATABASE_SYNCHRONIZE = 'true'
process.env.JWT_SECRET = 'integration-test-secret-with-at-least-32-characters'
delete process.env.ADMIN_NAME
delete process.env.ADMIN_EMAIL
delete process.env.ADMIN_PASSWORD

const { app } = require('../dist/app.js')
const { AppDataSource, initializeDatabase } = require('../dist/database/data-source.js')
const { User, UserRole } = require('../dist/entities/User.js')

let server
let baseUrl

before(async () => {
    await initializeDatabase()
    await new Promise((resolve) => {
        server = app.listen(0, '127.0.0.1', () => {
            const address = server.address()
            baseUrl = `http://127.0.0.1:${address.port}`
            resolve()
        })
    })
})

after(async () => {
    if (server) await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
    if (AppDataSource.isInitialized) await AppDataSource.destroy()
    rmSync(testDirectory, { recursive: true, force: true })
})

async function api(path, { method = 'GET', token, body } = {}) {
    const headers = { Accept: 'application/json' }
    if (token) headers.Authorization = `Bearer ${token}`
    if (body !== undefined) headers['Content-Type'] = 'application/json'

    const response = await fetch(`${baseUrl}${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
    })
    const text = await response.text()
    return {
        status: response.status,
        body: text ? JSON.parse(text) : undefined,
    }
}

async function register(nome, email) {
    const response = await api('/auth/register', {
        method: 'POST',
        body: { nome, email, senha: 'Senha123!' },
    })
    assert.equal(response.status, 201)
    return response.body
}

const projectPayload = {
    nome: 'MVP Gestor Tech',
    descricao: 'Fluxo principal persistido',
    dataInicio: '2026-11-01',
    dataFim: '2026-12-20',
    status: 'EM_ANDAMENTO',
}

test('fluxo principal, persistência, autenticação e regras de acesso', async () => {
    const unauthenticated = await api('/projects')
    assert.equal(unauthenticated.status, 401)

    const invalidLogin = await api('/auth/login', {
        method: 'POST',
        body: { email: 'ninguem@example.com', senha: 'senha-incorreta' },
    })
    assert.equal(invalidLogin.status, 401)

    const manager = await register('Gerente', 'gerente@example.com')
    const member = await register('Membro', 'membro@example.com')
    const outsider = await register('Administrador sem vínculo', 'admin-sem-vinculo@example.com')

    const currentUser = await api('/auth/me', { token: manager.token })
    assert.equal(currentUser.status, 200)
    assert.equal(currentUser.body.email, 'gerente@example.com')

    await AppDataSource.getRepository(User).update(outsider.user.id, { role: UserRole.ADMIN })
    const adminLogin = await api('/auth/login', {
        method: 'POST',
        body: { email: 'admin-sem-vinculo@example.com', senha: 'Senha123!' },
    })
    assert.equal(adminLogin.status, 200)
    assert.equal(adminLogin.body.user.role, 'ADMIN')

    const createProject = await api('/projects', {
        method: 'POST',
        token: manager.token,
        body: projectPayload,
    })
    assert.equal(createProject.status, 201)
    assert.equal(createProject.body.gerenteId, manager.user.id)
    assert.equal(createProject.body.papelAtual, 'GERENTE')
    const project = createProject.body

    const invalidDates = await api('/projects', {
        method: 'POST',
        token: manager.token,
        body: { ...projectPayload, nome: 'Datas inválidas', dataInicio: '2026-12-01', dataFim: '2026-11-01' },
    })
    assert.equal(invalidDates.status, 422)

    const memberProjectResponse = await api('/projects', {
        method: 'POST',
        token: member.token,
        body: { ...projectPayload, nome: 'Projeto do membro' },
    })
    assert.equal(memberProjectResponse.status, 201)
    const memberProject = memberProjectResponse.body

    const managerAsMember = await api(`/projects/${memberProject.id}/members`, {
        method: 'POST',
        token: member.token,
        body: { email: manager.user.email },
    })
    assert.equal(managerAsMember.status, 201)

    const managerProjects = await api('/projects', { token: manager.token })
    assert.equal(managerProjects.status, 200)
    assert.equal(managerProjects.body.find((item) => item.id === project.id).papelAtual, 'GERENTE')
    assert.equal(managerProjects.body.find((item) => item.id === memberProject.id).papelAtual, 'MEMBRO')

    const addMember = await api(`/projects/${project.id}/members`, {
        method: 'POST',
        token: manager.token,
        body: { email: member.user.email },
    })
    assert.equal(addMember.status, 201)
    const projectMember = addMember.body

    const duplicateMember = await api(`/projects/${project.id}/members`, {
        method: 'POST',
        token: manager.token,
        body: { email: member.user.email },
    })
    assert.equal(duplicateMember.status, 409)

    const adminWithoutAccess = await api(`/projects/${project.id}`, { token: adminLogin.body.token })
    assert.equal(adminWithoutAccess.status, 404)

    const memberCanRead = await api(`/projects/${project.id}`, { token: member.token })
    assert.equal(memberCanRead.status, 200)
    assert.equal(memberCanRead.body.papelAtual, 'MEMBRO')

    const memberCannotEditProject = await api(`/projects/${project.id}`, {
        method: 'PUT',
        token: member.token,
        body: { ...projectPayload, nome: 'Alteração indevida' },
    })
    assert.equal(memberCannotEditProject.status, 403)

    const memberCannotManageTeam = await api(`/projects/${project.id}/members`, {
        method: 'POST',
        token: member.token,
        body: { email: outsider.user.email },
    })
    assert.equal(memberCannotManageTeam.status, 403)

    const activityPayload = {
        titulo: 'Concluir fluxo principal',
        descricao: 'Atividade atribuída à segunda conta',
        prioridade: 'ALTA',
        status: 'A_FAZER',
        prazo: '2026-11-30',
        responsavelId: member.user.id,
    }

    const outsiderAsAssignee = await api(`/projects/${project.id}/activities`, {
        method: 'POST',
        token: manager.token,
        body: { ...activityPayload, titulo: 'Responsável inválido', responsavelId: outsider.user.id },
    })
    assert.equal(outsiderAsAssignee.status, 422)

    const { responsavelId: _responsavelId, ...activityWithoutAssignee } = activityPayload
    const createUnassigned = await api(`/projects/${project.id}/activities`, {
        method: 'POST',
        token: manager.token,
        body: { ...activityWithoutAssignee, titulo: 'Atividade sem responsável' },
    })
    assert.equal(createUnassigned.status, 201)
    assert.equal(createUnassigned.body.responsavelId, null)
    const deleteUnassigned = await api(`/projects/${project.id}/activities/${createUnassigned.body.id}`, {
        method: 'DELETE',
        token: manager.token,
    })
    assert.equal(deleteUnassigned.status, 204)

    const createActivity = await api(`/projects/${project.id}/activities`, {
        method: 'POST',
        token: manager.token,
        body: activityPayload,
    })
    assert.equal(createActivity.status, 201)
    assert.equal(createActivity.body.responsavelId, member.user.id)
    const assignedActivity = createActivity.body

    const createManagerActivity = await api(`/projects/${project.id}/activities`, {
        method: 'POST',
        token: manager.token,
        body: { ...activityPayload, titulo: 'Atividade do gerente', responsavelId: manager.user.id },
    })
    assert.equal(createManagerActivity.status, 201)
    const managerActivity = createManagerActivity.body

    const memberCannotCreate = await api(`/projects/${project.id}/activities`, {
        method: 'POST',
        token: member.token,
        body: { ...activityPayload, titulo: 'Criação indevida' },
    })
    assert.equal(memberCannotCreate.status, 403)

    const memberCannotEdit = await api(`/projects/${project.id}/activities/${assignedActivity.id}`, {
        method: 'PUT',
        token: member.token,
        body: { ...activityPayload, titulo: 'Edição indevida' },
    })
    assert.equal(memberCannotEdit.status, 403)

    const memberCannotDelete = await api(`/projects/${project.id}/activities/${assignedActivity.id}`, {
        method: 'DELETE',
        token: member.token,
    })
    assert.equal(memberCannotDelete.status, 403)

    const memberCannotUpdateOther = await api(`/projects/${project.id}/activities/${managerActivity.id}/status`, {
        method: 'PATCH',
        token: member.token,
        body: { status: 'CONCLUIDA' },
    })
    assert.equal(memberCannotUpdateOther.status, 403)

    const mine = await api('/activities/mine', { token: member.token })
    assert.equal(mine.status, 200)
    assert.equal(mine.body.length, 1)
    assert.equal(mine.body[0].projeto.nome, project.nome)

    const completeActivity = await api(`/projects/${project.id}/activities/${assignedActivity.id}/status`, {
        method: 'PATCH',
        token: member.token,
        body: { status: 'CONCLUIDA' },
    })
    assert.equal(completeActivity.status, 200)
    assert.equal(completeActivity.body.status, 'CONCLUIDA')

    const managerDashboardData = await api(`/projects/${project.id}/activities`, { token: manager.token })
    assert.equal(managerDashboardData.status, 200)
    assert.equal(managerDashboardData.body.length, 2)
    assert.equal(
        managerDashboardData.body.find((item) => item.id === assignedActivity.id).status,
        'CONCLUIDA',
    )

    await AppDataSource.destroy()
    await initializeDatabase()
    const afterReload = await api(`/projects/${project.id}/activities`, { token: manager.token })
    assert.equal(afterReload.status, 200)
    assert.equal(afterReload.body.length, 2)
    assert.equal(afterReload.body.find((item) => item.id === assignedActivity.id).status, 'CONCLUIDA')

    const removalWithAssignments = await api(`/projects/${project.id}/members/${projectMember.id}`, {
        method: 'DELETE',
        token: manager.token,
    })
    assert.equal(removalWithAssignments.status, 409)
    assert.match(removalWithAssignments.body.message, /reatribua ou deixe sem responsável/i)

    const unassign = await api(`/projects/${project.id}/activities/${assignedActivity.id}`, {
        method: 'PUT',
        token: manager.token,
        body: { ...activityPayload, status: 'CONCLUIDA', responsavelId: null },
    })
    assert.equal(unassign.status, 200)

    const removeMember = await api(`/projects/${project.id}/members/${projectMember.id}`, {
        method: 'DELETE',
        token: manager.token,
    })
    assert.equal(removeMember.status, 204)

    const isolatedProject = await api('/projects', {
        method: 'POST',
        token: manager.token,
        body: { ...projectPayload, nome: 'Projeto para validar rota' },
    })
    assert.equal(isolatedProject.status, 201)
    const mismatchedProject = await api(`/projects/${isolatedProject.body.id}/activities/${managerActivity.id}`, {
        method: 'PUT',
        token: manager.token,
        body: { ...activityPayload, responsavelId: null },
    })
    assert.equal(mismatchedProject.status, 404)

    const managerDeletes = await api(`/projects/${project.id}/activities/${managerActivity.id}`, {
        method: 'DELETE',
        token: manager.token,
    })
    assert.equal(managerDeletes.status, 204)
})
