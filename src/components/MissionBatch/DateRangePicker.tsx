import React from 'react'
import type { DateRangePickerProps } from '../../types/mission-batch'

/**
 * DateRangePicker - Seletor de período de envio
 * Permite selecionar data de início e fim
 */
export function DateRangePicker({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  error,
  minDate,
  maxDate,
}: DateRangePickerProps) {
  const formatDate = (date: Date | undefined): string => {
    if (!date) return ''
    return date.toISOString().split('T')[0]
  }

  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const minDateStr = formatDate(minDate || hoje)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
            Data de início
          </label>
          <input
            id="startDate"
            type="date"
            value={formatDate(startDate)}
            onChange={(e) => onStartChange(new Date(e.target.value + 'T00:00:00'))}
            min={minDateStr}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            aria-invalid={!!error}
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
            Data de término
          </label>
          <input
            id="endDate"
            type="date"
            value={formatDate(endDate)}
            onChange={(e) => onEndChange(new Date(e.target.value + 'T23:59:59'))}
            min={formatDate(startDate || minDate || hoje)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            aria-invalid={!!error}
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 flex items-center gap-2">
          <span>⚠️</span> {error}
        </p>
      )}

      {startDate && endDate && !error && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
          <p className="text-green-800">
            <strong>Período válido:</strong>{' '}
            {startDate.toLocaleDateString('pt-BR')} até {endDate.toLocaleDateString('pt-BR')} (
            {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} dias)
          </p>
        </div>
      )}
    </div>
  )
}
