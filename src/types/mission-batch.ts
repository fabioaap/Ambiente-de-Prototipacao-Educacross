/**
 * Types para o Wizard de Envio de Missões em Lote
 * Definições de tipos para turmas, missões, alunos, etc.
 */

/**
 * Turma - Representa uma turma na escola
 */
export interface Turma {
  id: string
  nome: string
  serie: string
  professor: string
  alunos: number
  disciplina: string
  ativo: boolean
}

/**
 * Missão - Representa uma missão gamificada
 */
export interface Missao {
  id: string
  titulo: string
  descricao?: string
  nivel: 'facil' | 'medio' | 'dificil'
  pontos: number
  competencias: string[]
  dataCriacao: Date
  uso: number // quantas vezes foi enviada
}

/**
 * Aluno - Representa um aluno
 */
export interface Aluno {
  id: string
  nome: string
  turmaId: string
  desempenho: 'acima' | 'medio' | 'abaixo'
  entregasAtrasadas: number
  grupo: 'lider' | 'engajado' | 'necessita-ajuda'
}

/**
 * Filtro de Alunos - Para aplicar critérios de seleção
 */
export interface StudentFilter {
  performanceLevel?: 'acima' | 'medio' | 'abaixo'
  deliveryStatus?: 'pendente' | 'em-progresso' | 'completo'
  groupId?: 'lider' | 'engajado' | 'necessita-ajuda'
  includeAll?: boolean
}

/**
 * Envio Anterior - Registro de envio anterior (para detectar conflitos)
 */
export interface EnvioAnterior {
  alunoId: string
  missaoId: string
  dataSolicitacao: Date
  dataFim: Date
  status: 'pendente' | 'em-progresso' | 'completo' | 'falhou'
}

/**
 * Batch de Envio - Registro de um envio em lote
 */
export interface MissionBatch {
  id: string // BTH-20251104-001
  schoolId: string // SCH001
  createdBy: string // user_id
  createdAt: Date

  // Seleção
  turmaId: string
  missionIds: string[]
  studentFilter: StudentFilter
  alunosSelecionados?: string[] // IDs dos alunos específicos

  // Parametrização
  startDate: Date
  endDate: Date
  obrigatoria: boolean
  customPoints?: number

  // Status
  status: 'draft' | 'pending' | 'processing' | 'completed' | 'failed'
  progress: {
    total: number
    succeeded: number
    failed: number
  }

  // Resultado
  result: {
    successCount: number
    failureCount: number
    completedAt?: Date
    errors?: Array<{ studentId: string; reason: string }>
  }

  // Auditoria
  auditLog: Array<{
    timestamp: Date
    action: string
    actor: string
  }>
}

/**
 * Estado da Store (Zustand) para o Wizard
 */
export interface MissionBatchStore {
  // Formulário
  selectedTurmaId: string | null
  selectedMissionIds: string[]
  studentFilter: StudentFilter
  startDate: Date | null
  endDate: Date | null
  customPoints: number | null

  // UI
  currentStep: 'turma' | 'missao' | 'alunos' | 'datas' | 'revisao' | 'enviando' | 'sucesso'
  loading: boolean
  error: string | null
  successData?: {
    batchId: string
    total: number
    sucesso: number
    falha: number
    tempoMs: number
  }

  // Métodos
  setSelectedTurma: (turmaId: string) => void
  addMission: (missionId: string) => void
  removeMission: (missionId: string) => void
  toggleMission: (missionId: string) => void
  setStudentFilter: (filter: StudentFilter) => void
  setDateRange: (start: Date, end: Date) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: MissionBatchStore['currentStep']) => void
  reset: () => void
  submit: () => Promise<void>
}

/**
 * Props para componentes da UI
 */

export interface ClassSelectorProps {
  turmas: Turma[]
  turmaId?: string
  onChange: (turmaId: string) => void
  disabled?: boolean
  error?: string
  loading?: boolean
}

export interface MissionCatalogProps {
  missoes: Missao[]
  missionIds: string[]
  onSelect: (missionId: string) => void
  onToggle: (missionId: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  disabled?: boolean
  loading?: boolean
}

export interface DateRangePickerProps {
  startDate?: Date
  endDate?: Date
  onStartChange: (date: Date) => void
  onEndChange: (date: Date) => void
  error?: string
  minDate?: Date
  maxDate?: Date
}

export interface StudentPreviewProps {
  turmaId: string
  filter: StudentFilter
  totalAlunos: number
  alunosFiltrados: number
}

export interface ReviewModalProps {
  turma: Turma
  missoes: Missao[]
  alunosSelecionados: number
  dataInicio: Date
  dataFim: Date
  conflitos?: number
  obrigatoria: boolean
  onConfirm: () => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export interface ProgressBarProps {
  progress: number // 0-100
  message?: string
  current?: number
  total?: number
  estimatedTime?: number
}

export interface SuccessNotificationProps {
  type: 'success' | 'partial' | 'error'
  titulo: string
  descricao: string
  detalhes?: {
    total: number
    sucesso: number
    falha: number
    tempoMs: number
  }
  batchId: string
  onDone: () => void
  showActions?: boolean
}

/**
 * Tipos para validação
 */
export interface ValidationError {
  field: string
  message: string
  severity: 'error' | 'warning' | 'info'
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}

/**
 * Resposta de API
 */
export interface SendMissionBatchResponse {
  batchId: string
  status: 'processing' | 'pending'
  total: number
  message: string
}

export interface BatchStatusResponse {
  batchId: string
  status: 'processing' | 'completed' | 'failed'
  progress: {
    total: number
    current: number
    percentage: number
  }
  result?: {
    successCount: number
    failureCount: number
    errors?: Array<{ studentId: string; reason: string }>
  }
}
