import React from 'react'

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-btn">☰</button>
        <div className="brand">educacross</div>
      </div>
      <div className="header-right">
        <div className="user">Afonso<br/><small>Gestor de Redes</small></div>
      </div>
    </header>
  )
}
