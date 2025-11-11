import React from 'react'
import type { ReviewModalProps } from '../../types/mission-batch'

/**
 * ReviewModal - Modal de revisão antes de confirmar envio
 * Exibe resumo completo do que será enviado
 */
export function ReviewModal({
  turma,
  missoes,
  alunosSelecionados,
  dataInicio,
  dataFim,
  conflitos = 0,
  obrigatoria = false,
  onConfirm,
  onCancel,
  loading = false,
}: ReviewModalProps) {
  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
        <span className="text-2xl">⚠️</span>
        <div>
          <p className="font-semibold text-amber-900">Ação irreversível</p>
          <p className="text-sm text-amber-800 mt-1">
            Você está prestes a enviar uma missão para {alunosSelecionados} aluno
            {alunosSelecionados !== 1 ? 's' : ''}. Confira os dados abaixo.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Resumo do Envio</h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Turma:</span>
              <span className="font-medium text-gray-900">
                {turma.nome} ({turma.alunos} alunos)
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Professor:</span>
              <span className="font-medium text-gray-900">{turma.professor}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Alunos selecionados:</span>
              <span className="font-medium text-gray-900">{alunosSelecionados}</span>
            </div>

            <hr className="my-2" />

            <div className="flex justify-between">
              <span className="text-gray-600">Missões:</span>
              <span className="font-medium text-gray-900">{missoes.length}</span>
            </div>

            {missoes.map((m) => (
              <div key={m.id} className="ml-4 text-gray-600">
                • {m.titulo} ({m.pontos} pts)
              </div>
            ))}

            <hr className="my-2" />

            <div className="flex justify-between">
              <span className="text-gray-600">Período:</span>
              <span className="font-medium text-gray-900">
                {dataInicio.toLocaleDateString('pt-BR')} até{' '}
                {dataFim.toLocaleDateString('pt-BR')}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Obrigatória:</span>
              <span className="font-medium text-gray-900">
                {obrigatoria ? '✓ Sim' : 'Não'}
              </span>
            </div>
          </div>
        </div>

        {conflitos > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Atenção:</strong> {conflitos} aluno{conflitos !== 1 ? 's' : ''} já
              possuem esta missão e será sobrescrita.
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-between pt-4 border-t">
        <button
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          Cancelar
        </button>

        <button
          onClick={onConfirm}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {loading && <span className="animate-spin">⏳</span>}
          {loading ? 'Enviando...' : '✓ Confirmar Envio'}
        </button>
      </div>
    </div>
  )
}
