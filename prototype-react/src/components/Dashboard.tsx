import React from 'react'
import { Progress } from './ui/progress'
import { missions } from '../mocks/missions'

function Card({title, children}:{title:string, children:React.ReactNode}){
  return (
    <div className="card">
      <div className="card-title">{title}</div>
      <div className="card-body">{children}</div>
    </div>
  )
}

function getIndicatorClass(status: string){
  switch(status){
    case 'finalizado': return 'bg-green-600'
    case 'critico': return 'bg-red-400'
    case 'moderado': return 'bg-orange-400'
    default: return 'bg-slate-300'
  }
}

export default function Dashboard(){
  return (
    <div className="dashboard">
      <div className="cards">
        <Card title="Progresso médio">
          <div className="stat">Em missões totais: <strong>20%</strong></div>
        </Card>
        <Card title="Alunos que jogaram">
          <div className="stat">74% - Moderado</div>
        </Card>
        <Card title="Rendimento médio">
          <div className="stat">95% - Avançado</div>
        </Card>
      </div>

      <div className="missions">
        <div className="missions-header">
          <h3>Missões</h3>
          <div className="controls">
            <input placeholder="Pesquisar por missão" />
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>MISSÃO</th>
              <th>USO NA REDE</th>
              <th>PROGRESSO</th>
              <th>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {missions.map((m, i) => (
              <tr key={m.id || i} className="mission-row">
                <td className="m-title">{m.title}</td>
                <td className="m-usage">{m.usage || '0 de 30'}</td>
                <td style={{width:360}}>
                  <div className="progress-cell">
                    <div className="progress-row">
                      <Progress value={m.progress} indicatorClassName={getIndicatorClass(m.status)} aria-valuenow={m.progress} aria-valuemax={100} role="progressbar" />
                    </div>
                  </div>
                </td>
                <td className="m-action">⚙️</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
