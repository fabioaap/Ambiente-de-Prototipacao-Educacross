import { render, screen } from "@testing-library/react"

import Dashboard from "../Dashboard"

describe("Dashboard", () => {
  it("exibe o titulo da secao de missoes", () => {
    render(<Dashboard />)
    expect(screen.getByText("Missoes")).toBeInTheDocument()
  })

  it("renderiza a tabela com as missoes mockadas", () => {
    render(<Dashboard />)
    const rows = screen.getAllByRole("row")
    // header + 6 missoes do mock
    expect(rows).toHaveLength(7)
  })
})
