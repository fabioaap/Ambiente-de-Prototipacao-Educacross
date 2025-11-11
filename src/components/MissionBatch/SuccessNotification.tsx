import React from 'react'
import type { SuccessNotificationProps } from '../../types/mission-batch'

/**
 * SuccessNotification - Notificação de resultado do envio
 * Exibe sucesso, parcial ou erro com detalhes
 */
export function SuccessNotification({
  type,
  titulo,
  descricao,
  detalhes,
  batchId,
  onDone,
  showActions = true,
}: SuccessNotificationProps) {
  const typeConfig = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: '✅',
      textColor: 'text-green-900',
      buttonColor: 'bg-green-600 hover:bg-green-700',
    },
    partial: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: '⚠️',
      textColor: 'text-yellow-900',
      buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: '❌',
      textColor: 'text-red-900',
      buttonColor: 'bg-red-600 hover:bg-red-700',
    },
  }

  const config = typeConfig[type]

  return (
    <div className={`${config.bg} border ${config.border} rounded-lg p-6 space-y-4`}>
      <div className="flex gap-4">
        <span className="text-4xl">{config.icon}</span>

        <div className="flex-1">
          <h2 className={`text-2xl font-bold ${config.textColor}`}>{titulo}</h2>
          <p className={`${config.textColor} text-opacity-80 mt-1`}>{descricao}</p>

          {detalhes && (
            <div className={`mt-4 space-y-2 text-sm ${config.textColor}`}>
              <div className="flex justify-between">
                <span>Total de alunos:</span>
                <strong>{detalhes.total}</strong>
              </div>
              <div className="flex justify-between">
                <span>Receberam:</span>
                <strong className="text-green-600">{detalhes.sucesso} ✓</strong>
              </div>
              {detalhes.falha > 0 && (
                <div className="flex justify-between">
                  <span>Falharam:</span>
                  <strong className="text-red-600">{detalhes.falha} ✗</strong>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-current border-opacity-20">
                <span>Tempo de envio:</span>
                <strong>{(detalhes.tempoMs / 1000).toFixed(2)}s</strong>
              </div>
            </div>
          )}

          <div className={`mt-4 p-3 bg-white bg-opacity-60 rounded text-xs font-mono ${config.textColor} text-opacity-70`}>
            ID do lote: <strong>{batchId}</strong>
          </div>
        </div>
      </div>

      {showActions && (
        <div className="flex gap-3 pt-4 border-t border-current border-opacity-20">
          <button
            onClick={onDone}
            className={`flex-1 ${config.buttonColor} text-white rounded-lg py-2 font-medium transition`}
          >
            ✓ Concluído
          </button>
        </div>
      )}
    </div>
  )
}
