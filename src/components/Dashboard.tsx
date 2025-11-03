import React from "react"

import { missions } from "../mocks/missions"
import { Progress } from "./ui/progress"

function Card({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="card">
      <div className="card-title">{title}</div>
      <div className="card-body">{children}</div>
    </div>
  )
}

function getIndicatorClass(status: string) {
  switch (status.toLowerCase()) {
    case "finalizado":
      return "bg-green-600"
    case "critico":
      return "bg-red-400"
    case "moderado":
      return "bg-orange-400"
    default:
      return "bg-slate-300"
  }
}

export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className="cards">
        <Card title="Progresso medio">
          <div className="stat">
            Em missoes totais: <strong>20%</strong>
          </div>
        </Card>
        <Card title="Alunos que jogaram">
          <div className="stat">74% - Moderado</div>
        </Card>
        <Card title="Rendimento medio">
          <div className="stat">95% - Avancado</div>
        </Card>
      </div>

      <div className="missions">
        <div className="missions-header">
          <h3>Missoes</h3>
          <div className="controls">
            <input placeholder="Pesquisar por missao" />
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>MISSAO</th>
              <th>USO NA REDE</th>
              <th>PROGRESSO</th>
              <th>ACOES</th>
            </tr>
          </thead>
          <tbody>
            {missions.map((mission, index) => (
              <tr key={mission.id ?? index} className="mission-row">
                <td className="m-title">
                  <div className="mission-name">{mission.title}</div>
                  {mission.plus ? (
                    <span className="badge ok" style={{ marginTop: 4 }}>
                      Missao Plus
                    </span>
                  ) : null}
                </td>
                <td className="m-usage">{mission.usage}</td>
                <td style={{ width: 360 }}>
                  <div className="progress-cell">
                    <div
                      className="status-label"
                      style={{ color: mission.statusColor }}
                    >
                      {mission.status}
                    </div>
                    <div className="progress-row">
                      <Progress
                        value={mission.progress}
                        indicatorClassName={
                          mission.barColor || getIndicatorClass(mission.status)
                        }
                        aria-valuenow={mission.progress}
                        aria-valuemax={100}
                        role="progressbar"
                      />
                    </div>
                  </div>
                </td>
                <td className="m-action">
                  {mission.progress === 100 ? "OK" : "..."}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
