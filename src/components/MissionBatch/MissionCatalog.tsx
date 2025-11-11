import React, { useMemo } from 'react'
import type { MissionCatalogProps } from '../../types/mission-batch'
import { Badge } from '../ui/Badge'

/**
 * MissionCatalog - Catálogo de missões com busca e filtro
 * Exibe tabela de missões disponíveis com checkboxes para seleção múltipla
 */
export function MissionCatalog({
  missoes,
  missionIds,
  onSelect,
  onToggle,
  searchQuery,
  onSearchChange,
  disabled = false,
  loading = false,
}: MissionCatalogProps) {
  const missioniesFiltradas = useMemo(() => {
    if (!searchQuery) return missoes

    const query = searchQuery.toLowerCase()
    return missoes.filter(
      (m) =>
        m.titulo.toLowerCase().includes(query) ||
        m.descricao?.toLowerCase().includes(query) ||
        m.competencias.some((c) => c.toLowerCase().includes(query)),
    )
  }, [missoes, searchQuery])

  const isSelected = (missionId: string) => missionIds.includes(missionId)

  const nivelColors = {
    facil: 'bg-green-50 text-green-700 border-green-200',
    medio: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    dificil: 'bg-red-50 text-red-700 border-red-200',
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="missaoSearch" className="block text-sm font-medium text-gray-700 mb-2">
          Buscar missão
        </label>
        <div className="relative">
          <input
            id="missaoSearch"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Digite parte do nome ou competência..."
            disabled={disabled || loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          {missioniesFiltradas.length} missões disponíveis
        </span>
        <span className="text-sm font-medium text-blue-600">
          {missionIds.length} selecionada{missionIds.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    missioniesFiltradas.length > 0 &&
                    missioniesFiltradas.every((m) => isSelected(m.id))
                  }
                  onChange={(e) => {
                    missioniesFiltradas.forEach((m) => {
                      if (e.target.checked && !isSelected(m.id)) {
                        onSelect(m.id)
                      } else if (!e.target.checked && isSelected(m.id)) {
                        onToggle(m.id)
                      }
                    })
                  }}
                  disabled={disabled}
                  aria-label="Selecionar todas as missões"
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Missão
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Nível</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Pontos</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Uso</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {missioniesFiltradas.map((missao) => (
              <tr
                key={missao.id}
                className={`hover:bg-gray-50 ${isSelected(missao.id) ? 'bg-blue-50' : ''}`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={isSelected(missao.id)}
                    onChange={() => onToggle(missao.id)}
                    disabled={disabled}
                    aria-label={`Selecionar ${missao.titulo}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-900">{missao.titulo}</p>
                    {missao.descricao && (
                      <p className="text-sm text-gray-600 mt-1">{missao.descricao}</p>
                    )}
                    {missao.competencias.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {missao.competencias.map((comp) => (
                          <Badge key={comp} variant="secondary" size="sm">
                            {comp}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant={
                      missao.nivel === 'facil' ? 'success' : missao.nivel === 'medio' ? 'warning' : 'error'
                    }
                    size="sm"
                  >
                    {missao.nivel.charAt(0).toUpperCase() + missao.nivel.slice(1)}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-center font-semibold text-gray-900">
                  {missao.pontos}
                </td>
                <td className="px-4 py-3 text-gray-600">{missao.uso}x</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {missioniesFiltradas.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhuma missão encontrada</p>
        </div>
      )}
    </div>
  )
}
