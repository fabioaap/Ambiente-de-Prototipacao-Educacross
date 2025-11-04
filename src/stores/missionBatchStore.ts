import { create } from 'zustand'
import type { MissionBatchStore, StudentFilter } from '../types/mission-batch'
import { simularEnvioBatch } from '../mocks/mission-batch'

/**
 * Zustand Store para o Wizard de Envio de Missões
 * Gerencia estado global do formulário e navegação entre etapas
 */
export const useMissionBatchStore = create<MissionBatchStore>((set, get) => ({
  // Estado inicial
  selectedTurmaId: null,
  selectedMissionIds: [],
  studentFilter: {
    includeAll: true,
  },
  startDate: null,
  endDate: null,
  customPoints: null,

  // UI State
  currentStep: 'turma',
  loading: false,
  error: null,
  successData: undefined,

  // Métodos de seleção
  setSelectedTurma: (turmaId: string) =>
    set({
      selectedTurmaId: turmaId,
      error: null,
    }),

  addMission: (missionId: string) => {
    const current = get().selectedMissionIds
    if (!current.includes(missionId)) {
      set({
        selectedMissionIds: [...current, missionId],
      })
    }
  },

  removeMission: (missionId: string) => {
    set({
      selectedMissionIds: get().selectedMissionIds.filter((id) => id !== missionId),
    })
  },

  toggleMission: (missionId: string) => {
    const current = get().selectedMissionIds
    if (current.includes(missionId)) {
      set({
        selectedMissionIds: current.filter((id) => id !== missionId),
      })
    } else {
      set({
        selectedMissionIds: [...current, missionId],
      })
    }
  },

  setStudentFilter: (filter: StudentFilter) =>
    set({
      studentFilter: filter,
      error: null,
    }),

  setDateRange: (start: Date, end: Date) => {
    // Validações básicas
    if (start > end) {
      set({
        error: 'Data de início não pode ser maior que data de fim',
      })
      return
    }

    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    if (start < hoje) {
      set({
        error: 'Data de início não pode ser no passado',
      })
      return
    }

    set({
      startDate: start,
      endDate: end,
      error: null,
    })
  },

  // Navegação entre steps
  nextStep: () => {
    const current = get().currentStep
    const steps: Array<MissionBatchStore['currentStep']> = [
      'turma',
      'missao',
      'alunos',
      'datas',
      'revisao',
      'enviando',
      'sucesso',
    ]
    const currentIndex = steps.indexOf(current)

    if (currentIndex < steps.length - 1) {
      // Validar antes de avançar
      const validacao = validarStep(current, get())
      if (!validacao.valid) {
        set({ error: validacao.errors[0]?.message || 'Erro na validação' })
        return
      }

      set({ currentStep: steps[currentIndex + 1], error: null })
    }
  },

  prevStep: () => {
    const current = get().currentStep
    const steps: Array<MissionBatchStore['currentStep']> = [
      'turma',
      'missao',
      'alunos',
      'datas',
      'revisao',
      'enviando',
      'sucesso',
    ]
    const currentIndex = steps.indexOf(current)

    if (currentIndex > 0) {
      set({ currentStep: steps[currentIndex - 1], error: null })
    }
  },

  goToStep: (step: MissionBatchStore['currentStep']) => {
    set({ currentStep: step, error: null })
  },

  reset: () =>
    set({
      selectedTurmaId: null,
      selectedMissionIds: [],
      studentFilter: { includeAll: true },
      startDate: null,
      endDate: null,
      customPoints: null,
      currentStep: 'turma',
      loading: false,
      error: null,
      successData: undefined,
    }),

  // Submissão
  submit: async () => {
    const state = get()

    // Validações finais
    if (!state.selectedTurmaId) {
      set({ error: 'Selecione uma turma' })
      return
    }

    if (state.selectedMissionIds.length === 0) {
      set({ error: 'Selecione pelo menos uma missão' })
      return
    }

    if (!state.startDate || !state.endDate) {
      set({ error: 'Defina o período de envio' })
      return
    }

    set({ loading: true, currentStep: 'enviando', error: null })

    try {
      // Simular envio em lote
      const result = await simularEnvioBatch(
        state.selectedTurmaId,
        state.selectedMissionIds[0], // Usar primeira missão para simular
        state.startDate,
        state.endDate,
      )

      // Aguardar um pouco para mostrar progresso
      await new Promise((resolve) => setTimeout(resolve, 1500))

      set({
        loading: false,
        currentStep: 'sucesso',
        successData: result,
        error: null,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao enviar missões'
      set({
        loading: false,
        error: errorMessage,
        currentStep: 'revisao',
      })
    }
  },
}))

/**
 * Função para validar cada step
 */
function validarStep(step: MissionBatchStore['currentStep'], state: MissionBatchStore) {
  switch (step) {
    case 'turma':
      if (!state.selectedTurmaId) {
        return { valid: false, errors: [{ message: 'Selecione uma turma' }] }
      }
      return { valid: true, errors: [] }

    case 'missao':
      if (state.selectedMissionIds.length === 0) {
        return { valid: false, errors: [{ message: 'Selecione pelo menos uma missão' }] }
      }
      return { valid: true, errors: [] }

    case 'datas':
      if (!state.startDate || !state.endDate) {
        return { valid: false, errors: [{ message: 'Defina o período de envio' }] }
      }
      if (state.startDate > state.endDate) {
        return {
          valid: false,
          errors: [{ message: 'Data de início deve ser antes da data de fim' }],
        }
      }
      return { valid: true, errors: [] }

    case 'revisao':
      // Todas as validações já foram feitas
      return { valid: true, errors: [] }

    default:
      return { valid: true, errors: [] }
  }
}
