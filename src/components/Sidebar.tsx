import React from 'react'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">educacross</div>
      <nav className="nav">
        <ul>
          <li className="active">Painel Inicial</li>
          <li>Relatórios Gerais</li>
          <li>Missões da Escola</li>
          <li className="muted">Sistema de Ensino</li>
          <li>Eventos</li>
        </ul>
      </nav>
    </aside>
  )
}
