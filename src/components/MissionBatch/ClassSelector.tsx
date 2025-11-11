import React from 'react'
import type { ClassSelectorProps } from '../../types/mission-batch'

/**
 * ClassSelector - Seletor de turma
 * Componente simples de dropdown para selecionar uma turma
 */
export function ClassSelector({
  turmas,
  turmaId,
  onChange,
  disabled = false,
  error,
  loading = false,
}: ClassSelectorProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="turmaSelect" className="block text-sm font-medium text-gray-700">
        Selecione a turma
      </label>
      <select
        id="turmaSelect"
        value={turmaId || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || loading}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 ${
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:ring-blue-500'
        }`}
        aria-invalid={!!error}
        aria-describedby={error ? 'turmaError' : undefined}
      >
        <option value="">-- Selecione uma turma --</option>
        {turmas.map((turma) => (
          <option key={turma.id} value={turma.id}>
            {turma.nome} • {turma.alunos} alunos • {turma.professor}
          </option>
        ))}
      </select>
      {error && (
        <p id="turmaError" className="text-sm text-red-500 flex items-center gap-2">
          <span>⚠️</span> {error}
        </p>
      )}
      {turmaId && !error && (
        <p className="text-sm text-green-600 flex items-center gap-2">
          <span>✓</span> Turma selecionada
        </p>
      )}
    </div>
  )
}
