import React, { useEffect, useState } from 'react'
import type { ProgressBarProps } from '../../types/mission-batch'

/**
 * ProgressBar - Barra de progresso durante envio
 * Exibe porcentagem, contador e tempo estimado
 */
export function ProgressBar({
  progress,
  message = 'Enviando...',
  current,
  total,
  estimatedTime,
}: ProgressBarProps) {
  const [remainingTime, setRemainingTime] = useState(estimatedTime)

  useEffect(() => {
    if (!estimatedTime || progress >= 100) return

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev! <= 1) return 0
        return prev! - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [estimatedTime, progress])

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-900 mb-2">{message}</p>
        <p className="text-sm text-gray-600">
          {current && total && (
            <>
              {current} de {total} alunos
              {remainingTime && ` • ${remainingTime}s restantes`}
            </>
          )}
        </p>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <div className="text-center">
        <span className="text-2xl font-bold text-blue-600">{Math.round(progress)}%</span>
      </div>

      {progress < 100 && (
        <div className="flex justify-center">
          <div className="animate-bounce">
            <span className="text-3xl">🚀</span>
          </div>
        </div>
      )}
    </div>
  )
}
