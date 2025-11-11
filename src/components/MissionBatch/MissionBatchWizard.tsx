import React, { useMemo } from 'react'
import { useMissionBatchStore } from '../../stores/missionBatchStore'
import { turmasMock, missoesMock, getAlunosByTurmaId } from '../../mocks/mission-batch'
import { ClassSelector } from './ClassSelector'
import { MissionCatalog } from './MissionCatalog'
import { DateRangePicker } from './DateRangePicker'
import { ReviewModal } from './ReviewModal'
import { ProgressBar } from './ProgressBar'
import { SuccessNotification } from './SuccessNotification'

/**
 * MissionBatchWizard - Wizard completo para envio de missões em lote
 * Componente container que orquestra todos os componentes filhos
 */
export function MissionBatchWizard() {
  const store = useMissionBatchStore()

  // Dados derivados
  const turmaAtual = useMemo(() => turmasMock.find((t) => t.id === store.selectedTurmaId), [store.selectedTurmaId])
  const missoesAtual = useMemo(() => missoesMock.filter((m) => store.selectedMissionIds.includes(m.id)), [store.selectedMissionIds])
  const alunosSelecionados = useMemo(() => {
    if (!turmaAtual) return 0
    const alunos = getAlunosByTurmaId(turmaAtual.id)
    // TODO: aplicar filtros de studentFilter aqui
    return alunos.length
  }, [turmaAtual, store.studentFilter])

  const handleNextStep = () => {
    store.nextStep()
  }

  const handlePrevStep = () => {
    store.prevStep()
  }

  const handleReset = () => {
    store.reset()
  }

  // Determinar se pode avançar
  const canAdvance = useMemo(() => {
    switch (store.currentStep) {
      case 'turma':
        return !!store.selectedTurmaId
      case 'missao':
        return store.selectedMissionIds.length > 0
      case 'datas':
        return !!store.startDate && !!store.endDate
      default:
        return true
    }
  }, [store.currentStep, store.selectedTurmaId, store.selectedMissionIds, store.startDate, store.endDate])

  const stepsLabels = ['Turma', 'Missão', 'Alunos', 'Datas', 'Revisão']
  const currentStepIndex = ['turma', 'missao', 'alunos', 'datas', 'revisao'].indexOf(
    store.currentStep as string,
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">📚 Enviar Missões em Lote</h1>
          <p className="text-gray-600 mt-2">
            Selecione as turmas, missões e período para envio em massa
          </p>
        </div>

        {/* Steps Indicator */}
        {store.currentStep !== 'enviando' && store.currentStep !== 'sucesso' && (
          <div className="bg-white rounded-lg p-6 shadow-md mb-8">
            <div className="flex justify-between items-center">
              {stepsLabels.map((label, index) => {
                const isActive = index === currentStepIndex
                const isDone = index < currentStepIndex
                return (
                  <div key={label} className="flex items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        isDone
                          ? 'bg-green-500 text-white'
                          : isActive
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {isDone ? '✓' : index + 1}
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                        {label}
                      </p>
                    </div>
                    {index < stepsLabels.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-4 ${isDone ? 'bg-green-500' : 'bg-gray-300'}`}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Etapa 1: Turma */}
          {store.currentStep === 'turma' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">1️⃣ Selecione a Turma</h2>
                <p className="text-gray-600">Escolha a turma que receberá a(s) missão(ões)</p>
              </div>
              <ClassSelector
                turmas={turmasMock}
                turmaId={store.selectedTurmaId || undefined}
                onChange={store.setSelectedTurma}
                error={store.error}
              />
            </div>
          )}

          {/* Etapa 2: Missão */}
          {store.currentStep === 'missao' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">2️⃣ Selecione as Missões</h2>
                <p className="text-gray-600">
                  Turma selecionada: <strong>{turmaAtual?.nome}</strong>
                </p>
              </div>
              <MissionCatalog
                missoes={missoesMock}
                missionIds={store.selectedMissionIds}
                onSelect={store.addMission}
                onToggle={store.toggleMission}
                searchQuery=""
                onSearchChange={() => {}}
              />
            </div>
          )}

          {/* Etapa 3: Alunos */}
          {store.currentStep === 'alunos' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">3️⃣ Selecione os Alunos</h2>
                <p className="text-gray-600">Escolha quais alunos receberão a(s) missão(ões)</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>👥 {alunosSelecionados} alunos</strong> da turma {turmaAtual?.nome}{' '}
                  serão selecionados para receber as missões.
                </p>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={store.studentFilter.includeAll}
                    onChange={(e) =>
                      store.setStudentFilter({
                        ...store.studentFilter,
                        includeAll: e.target.checked,
                      })
                    }
                    className="w-5 h-5"
                  />
                  <span className="font-medium text-gray-900">Enviar para todos os alunos</span>
                </label>
              </div>
            </div>
          )}

          {/* Etapa 4: Datas */}
          {store.currentStep === 'datas' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">4️⃣ Defina o Período</h2>
                <p className="text-gray-600">Quando a missão estará disponível para os alunos?</p>
              </div>
              <DateRangePicker
                startDate={store.startDate || undefined}
                endDate={store.endDate || undefined}
                onStartChange={(date) => {
                  if (store.endDate) {
                    store.setDateRange(date, store.endDate)
                  } else {
                    store.setDateRange(date, new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000))
                  }
                }}
                onEndChange={(date) => {
                  if (store.startDate) {
                    store.setDateRange(store.startDate, date)
                  }
                }}
                error={store.error}
              />
            </div>
          )}

          {/* Etapa 5: Revisão */}
          {store.currentStep === 'revisao' && turmaAtual && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">5️⃣ Revise e Confirme</h2>
                <p className="text-gray-600">Confira os dados antes de enviar</p>
              </div>
              <ReviewModal
                turma={turmaAtual}
                missoes={missoesAtual}
                alunosSelecionados={alunosSelecionados}
                dataInicio={store.startDate!}
                dataFim={store.endDate!}
                conflitos={0}
                obrigatoria={false}
                onConfirm={store.submit}
                onCancel={handlePrevStep}
                loading={store.loading}
              />
            </div>
          )}

          {/* Enviando */}
          {store.currentStep === 'enviando' && (
            <div className="space-y-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900">🚀 Enviando...</h2>
              <ProgressBar progress={75} message="Enviando para os alunos" current={75} total={alunosSelecionados} />
            </div>
          )}

          {/* Sucesso */}
          {store.currentStep === 'sucesso' && store.successData && (
            <div className="space-y-6">
              <SuccessNotification
                type={store.successData.falha === 0 ? 'success' : 'partial'}
                titulo={store.successData.falha === 0 ? '✅ Enviado com Sucesso!' : '⚠️ Envio Parcial'}
                descricao={
                  store.successData.falha === 0
                    ? `${store.successData.total} alunos receberam a(s) missão(ões).`
                    : `${store.successData.sucesso} de ${store.successData.total} alunos receberam a(s) missão(ões).`
                }
                detalhes={store.successData}
                batchId={store.successData.batchId}
                onDone={handleReset}
              />
            </div>
          )}

          {/* Error Display */}
          {store.error && store.currentStep !== 'revisao' && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">
                <strong>❌ Erro:</strong> {store.error}
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          {store.currentStep !== 'enviando' && store.currentStep !== 'sucesso' && (
            <div className="flex gap-4 mt-8 pt-6 border-t">
              <button
                onClick={handlePrevStep}
                disabled={store.currentStep === 'turma'}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Voltar
              </button>

              <div className="flex-1" />

              <button
                onClick={handleReset}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                Cancelar
              </button>

              <button
                onClick={handleNextStep}
                disabled={!canAdvance || store.loading}
                className={`px-6 py-2 rounded-lg font-medium text-white ${
                  canAdvance
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-300 cursor-not-allowed'
                } disabled:opacity-50`}
              >
                {store.currentStep === 'revisao' ? '✓ Enviar' : 'Próximo →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
