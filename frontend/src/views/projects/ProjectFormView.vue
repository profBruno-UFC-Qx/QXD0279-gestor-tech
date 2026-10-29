<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import FormField from '@/components/ui/FormField.vue'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import { getErrorMessage } from '@/services/errors'
import { createProject, getProject, updateProject } from '@/services/project'
import type { ProjectPayload } from '@/types/Project'

const route = useRoute()
const router = useRouter()
const projectId = computed(() => Number(route.params.projectId))
const isEditing = computed(() => Number.isInteger(projectId.value) && projectId.value > 0)
const isLoading = ref(isEditing.value)
const isSaving = ref(false)
const errorMessage = ref('')
const form = reactive<ProjectPayload>({ nome: '', descricao: '', dataInicio: '', dataFim: '', status: 'PLANEJADO' })

onMounted(async () => {
    if (!isEditing.value) return
    try {
        const project = await getProject(projectId.value)
        Object.assign(form, { nome: project.nome, descricao: project.descricao, dataInicio: project.dataInicio, dataFim: project.dataFim, status: project.status })
    } catch (error: unknown) {
        errorMessage.value = getErrorMessage(error, 'Não foi possível carregar o projeto.')
    } finally {
        isLoading.value = false
    }
})

async function handleSubmit(): Promise<void> {
    errorMessage.value = ''
    if (!form.nome.trim() || !form.dataInicio || !form.dataFim) {
        errorMessage.value = 'Preencha nome, data de início e data de término.'
        return
    }
    if (form.dataFim < form.dataInicio) {
        errorMessage.value = 'A data de término não pode ser anterior à data de início.'
        return
    }

    isSaving.value = true
    try {
        const savedProject = isEditing.value ? await updateProject(projectId.value, form) : await createProject(form)
        toast.success(isEditing.value ? 'Projeto atualizado' : 'Projeto criado', { description: `${savedProject.nome} foi salvo com sucesso.` })
        await router.push({ name: 'project-overview', params: { projectId: savedProject.id } })
    } catch (error: unknown) {
        errorMessage.value = getErrorMessage(error, 'Não foi possível salvar o projeto.')
        toast.error('Não foi possível salvar o projeto')
    } finally {
        isSaving.value = false
    }
}
</script>

<template>
    <section class="page-stack form-page">
        <PageHeader :eyebrow="isEditing ? 'Configurações do projeto' : 'Novo workspace'" :title="isEditing ? 'Editar projeto' : 'Criar projeto'" description="Defina as informações essenciais para planejar e acompanhar a entrega." />
        <LoadingSkeleton v-if="isLoading" />
        <BaseCard v-else class="form-card">
            <form class="project-form" novalidate @submit.prevent="handleSubmit">
                <section class="form-section">
                    <div class="section-copy"><h2>Informações gerais</h2><p>Identificação e contexto principal do projeto.</p></div>
                    <div class="fields">
                        <BaseInput v-model="form.nome" label="Nome do projeto" placeholder="Ex.: Portal do cliente" autocomplete="off" required />
                        <FormField label="Descrição" hint="Descreva o objetivo e o resultado esperado do projeto.">
                            <template #default="{ id, descriptionId }"><textarea :id="id" v-model="form.descricao" rows="5" :aria-describedby="descriptionId" placeholder="Objetivo, contexto e escopo principal" /></template>
                        </FormField>
                    </div>
                </section>
                <div class="divider" />
                <section class="form-section">
                    <div class="section-copy"><h2>Planejamento</h2><p>Período e estágio atual da entrega.</p></div>
                    <div class="fields">
                        <div class="form-row"><BaseInput v-model="form.dataInicio" type="date" label="Data de início" required /><BaseInput v-model="form.dataFim" type="date" label="Data de término" required /></div>
                        <FormField label="Status">
                            <template #default="{ id }"><select :id="id" v-model="form.status"><option value="PLANEJADO">Planejado</option><option value="EM_ANDAMENTO">Em andamento</option><option value="CONCLUIDO">Concluído</option></select></template>
                        </FormField>
                    </div>
                </section>
                <div v-if="errorMessage" class="error-banner" role="alert">{{ errorMessage }}</div>
                <footer class="form-actions"><BaseButton variant="secondary" @click="router.back()">Cancelar</BaseButton><BaseButton type="submit" :loading="isSaving">{{ isEditing ? 'Salvar alterações' : 'Criar projeto' }}</BaseButton></footer>
            </form>
        </BaseCard>
    </section>
</template>

<style scoped>
.form-page { max-width: 1040px; }
.form-card { padding: 0; overflow: hidden; }
.project-form { display: grid; }
.form-section { display: grid; grid-template-columns: minmax(180px, .65fr) minmax(0, 1.35fr); gap: var(--space-8); padding: var(--space-8); }
.section-copy h2 { font-size: var(--font-size-section-title); }
.section-copy p { margin-top: var(--space-2); color: var(--color-text-secondary); font-size: var(--font-size-small); }
.fields { display: grid; gap: var(--space-5); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
.divider { height: 1px; background: var(--color-divider); }
.error-banner { margin: 0 var(--space-8) var(--space-6); }
.form-actions { display: flex; justify-content: flex-end; gap: var(--space-2); padding: var(--space-5) var(--space-8); border-top: 1px solid var(--color-divider); background: var(--color-surface-subtle); }
@media (max-width: 720px) { .form-section { grid-template-columns: 1fr; gap: var(--space-5); padding: var(--space-6); } .form-actions { padding-inline: var(--space-6); } .error-banner { margin-inline: var(--space-6); } }
@media (max-width: 520px) { .form-row { grid-template-columns: 1fr; } .form-actions { flex-direction: column-reverse; } .form-actions :deep(.button) { width: 100%; } }
</style>
