import React from 'react'

function Card({title, children}:{title:string, children:React.ReactNode}){
  return (
    <div className="card">
      <div className="card-title">{title}</div>
      <div className="card-body">{children}</div>
    </div>
  )
}

function Progress({value}:{value:number}){
  return (
    <div className="progress-wrap">
      <div className="progress-bar" style={{width: `${value}%`}} />
    </div>
  )
}

export default function Dashboard(){
  const missions = [
    {id:1, title:'Capítulo 1: Sistema de numeração decimal e números naturais', progress:100},
    {id:2, title:'Capítulo 2: Números Racionais', progress:20},
    {id:3, title:'Capítulo 3: Números Decimais', progress:20},
    {id:4, title:'Complementar: Frações 1', progress:0},
    {id:5, title:'Capítulo 4: Números inteiros', progress:0}
  ]

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
          <tbody>
            {missions.map(m => (
              <tr key={m.id}>
                <td className="m-title">{m.title}</td>
                <td style={{width:200}}><Progress value={m.progress} /></td>
                <td className="m-percent">{m.progress}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
