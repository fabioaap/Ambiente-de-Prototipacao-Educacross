import type { Turma, Missao, Aluno, EnvioAnterior } from '../types/mission-batch'

/**
 * Mock de Turmas
 * Simula 5-8 turmas de uma escola
 */
export const turmasMock: Turma[] = [
  {
    id: 'TM001',
    nome: '7º Ano A',
    serie: '7º',
    professor: 'João Silva',
    alunos: 35,
    disciplina: 'Matemática',
    ativo: true,
  },
  {
    id: 'TM002',
    nome: '7º Ano B',
    serie: '7º',
    professor: 'Maria Santos',
    alunos: 32,
    disciplina: 'Matemática',
    ativo: true,
  },
  {
    id: 'TM003',
    nome: '7º Ano C',
    serie: '7º',
    professor: 'Pedro Costa',
    alunos: 30,
    disciplina: 'Matemática',
    ativo: true,
  },
  {
    id: 'TM004',
    nome: '8º Ano A',
    serie: '8º',
    professor: 'Ana Lima',
    alunos: 38,
    disciplina: 'Matemática',
    ativo: true,
  },
  {
    id: 'TM005',
    nome: '8º Ano B',
    serie: '8º',
    professor: 'Carlos Mendes',
    alunos: 36,
    disciplina: 'Matemática',
    ativo: true,
  },
  {
    id: 'TM006',
    nome: '9º Ano A',
    serie: '9º',
    professor: 'Fernanda Gomes',
    alunos: 40,
    disciplina: 'Matemática',
    ativo: true,
  },
]

/**
 * Mock de Missões
 * 15 missões com diferentes níveis, pontos e competências
 */
export const missoesMock: Missao[] = [
  {
    id: 'MS001',
    titulo: 'Desafio: Equações Lineares',
    descricao: 'Resolva 10 equações lineares com uma variável',
    nivel: 'medio',
    pontos: 50,
    competencias: ['Álgebra', 'Pensamento Crítico'],
    dataCriacao: new Date('2025-10-15'),
    uso: 45,
  },
  {
    id: 'MS002',
    titulo: 'Desafio: Geometria Plana',
    descricao: 'Calcule áreas e perímetros de figuras planas',
    nivel: 'medio',
    pontos: 60,
    competencias: ['Geometria', 'Visualização Espacial'],
    dataCriacao: new Date('2025-10-10'),
    uso: 32,
  },
  {
    id: 'MS003',
    titulo: 'Desafio: Frações',
    descricao: 'Operações básicas com frações',
    nivel: 'facil',
    pontos: 25,
    competencias: ['Aritmética', 'Conceitos Básicos'],
    dataCriacao: new Date('2025-09-28'),
    uso: 78,
  },
  {
    id: 'MS004',
    titulo: 'Desafio: Sistemas Lineares',
    descricao: 'Resolva sistemas de equações lineares 2x2 e 3x3',
    nivel: 'dificil',
    pontos: 100,
    competencias: ['Álgebra Avançada', 'Raciocínio Lógico'],
    dataCriacao: new Date('2025-10-01'),
    uso: 18,
  },
  {
    id: 'MS005',
    titulo: 'Desafio: Probabilidade',
    descricao: 'Conceitos de probabilidade e análise combinatória',
    nivel: 'dificil',
    pontos: 80,
    competencias: ['Estatística', 'Pensamento Crítico'],
    dataCriacao: new Date('2025-09-20'),
    uso: 25,
  },
  {
    id: 'MS006',
    titulo: 'Desafio: Potenciação',
    descricao: 'Propriedades e operações com potências',
    nivel: 'facil',
    pontos: 30,
    competencias: ['Aritmética', 'Propriedades Matemáticas'],
    dataCriacao: new Date('2025-09-15'),
    uso: 52,
  },
  {
    id: 'MS007',
    titulo: 'Desafio: Radiciação',
    descricao: 'Raízes quadradas, cúbicas e operações',
    nivel: 'medio',
    pontos: 45,
    competencias: ['Aritmética', 'Conceitos Avançados'],
    dataCriacao: new Date('2025-09-10'),
    uso: 38,
  },
  {
    id: 'MS008',
    titulo: 'Desafio: Funções Quadráticas',
    descricao: 'Parábolas, vértice e raízes de funções quadráticas',
    nivel: 'dificil',
    pontos: 90,
    competencias: ['Funções', 'Análise Gráfica'],
    dataCriacao: new Date('2025-08-30'),
    uso: 22,
  },
  {
    id: 'MS009',
    titulo: 'Desafio: Trigonometria',
    descricao: 'Seno, cosseno, tangente e aplicações',
    nivel: 'dificil',
    pontos: 100,
    competencias: ['Trigonometria', 'Aplicações Práticas'],
    dataCriacao: new Date('2025-08-20'),
    uso: 15,
  },
  {
    id: 'MS010',
    titulo: 'Desafio: Polinômios',
    descricao: 'Operações e fatoração de polinômios',
    nivel: 'medio',
    pontos: 55,
    competencias: ['Álgebra', 'Fatoração'],
    dataCriacao: new Date('2025-08-10'),
    uso: 28,
  },
  {
    id: 'MS011',
    titulo: 'Desafio: Lógica Matemática',
    descricao: 'Proposições, conectivos e tabelas-verdade',
    nivel: 'medio',
    pontos: 50,
    competencias: ['Lógica', 'Raciocínio'],
    dataCriacao: new Date('2025-07-30'),
    uso: 35,
  },
  {
    id: 'MS012',
    titulo: 'Desafio: Estatística Básica',
    descricao: 'Média, mediana, moda e desvio padrão',
    nivel: 'facil',
    pontos: 40,
    competencias: ['Estatística', 'Análise de Dados'],
    dataCriacao: new Date('2025-07-20'),
    uso: 60,
  },
  {
    id: 'MS013',
    titulo: 'Desafio: Matrizes',
    descricao: 'Operações com matrizes e determinantes',
    nivel: 'dificil',
    pontos: 95,
    competencias: ['Álgebra Linear', 'Cálculos Avançados'],
    dataCriacao: new Date('2025-07-10'),
    uso: 12,
  },
  {
    id: 'MS014',
    titulo: 'Desafio: Razão e Proporção',
    descricao: 'Razões, proporções e regra de três',
    nivel: 'facil',
    pontos: 35,
    competencias: ['Proporcionalidade', 'Conceitos Básicos'],
    dataCriacao: new Date('2025-06-30'),
    uso: 85,
  },
  {
    id: 'MS015',
    titulo: 'Desafio: Juros Compostos',
    descricao: 'Cálculo de juros simples e compostos',
    nivel: 'medio',
    pontos: 65,
    competencias: ['Matemática Financeira', 'Aplicações Práticas'],
    dataCriacao: new Date('2025-06-20'),
    uso: 42,
  },
]

/**
 * Gerador de Alunos Mock
 * Cria lista realista de alunos para cada turma
 */
function gerarAlunos(): Aluno[] {
  const nomes = [
    'João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Lima', 'Carlos Mendes',
    'Fernanda Gomes', 'Ricardo Oliveira', 'Juliana Pereira', 'Bruno Martins', 'Camila Rocha',
    'Diego Ferreira', 'Lucas Alves', 'Beatriz Souza', 'Felipe Monteiro', 'Gabriela Cardoso',
    'Rafael Barbosa', 'Mariana Ribeiro', 'Gustavo Andrade', 'Carolina Dias', 'Thiago Santos',
    'Isabela Costa', 'Mateus Oliveira', 'Laura Silva', 'Leonardo Duarte', 'Sofia Martins',
    'Vitor Gonçalves', 'Letícia Fernandes', 'João Paulo', 'Bárbara Gomes', 'Felipe Castro',
    'Amanda Rocha', 'Rodrigo Silva', 'Valentina Cardoso', 'Daniel Pereira', 'Bianca Lima',
    'André Barbosa', 'Natália Souza', 'Henrique Alves', 'Yasmin Monteiro', 'Antonio Ribeiro',
  ]

  const desempenhos: Array<'acima' | 'medio' | 'abaixo'> = ['acima', 'medio', 'abaixo']
  const grupos: Array<'lider' | 'engajado' | 'necessita-ajuda'> = ['lider', 'engajado', 'necessita-ajuda']

  return turmasMock.flatMap((turma) => {
    const alunosCount = turma.alunos
    const alunos: Aluno[] = []

    for (let i = 0; i < alunosCount; i++) {
      const desempenho = desempenhos[Math.floor(Math.random() * desempenhos.length)]
      const grupo = grupos[Math.floor(Math.random() * grupos.length)]

      alunos.push({
        id: `AL${String(turma.id).slice(2)}${String(i + 1).padStart(3, '0')}`,
        nome: nomes[(i + Math.random() * nomes.length) % nomes.length],
        turmaId: turma.id,
        desempenho,
        entregasAtrasadas: Math.floor(Math.random() * 4),
        grupo,
      })
    }

    return alunos
  })
}

export const alunosMock: Aluno[] = gerarAlunos()

/**
 * Mock de Envios Anteriores
 * Simula conflitos (alunos que já receberam a missão)
 */
export const enviosaAnterioresMock: EnvioAnterior[] = [
  {
    alunoId: 'AL0010001',
    missaoId: 'MS001',
    dataSolicitacao: new Date('2025-10-20'),
    dataFim: new Date('2025-10-27'),
    status: 'em-progresso',
  },
  {
    alunoId: 'AL0010002',
    missaoId: 'MS001',
    dataSolicitacao: new Date('2025-10-20'),
    dataFim: new Date('2025-10-27'),
    status: 'completo',
  },
  {
    alunoId: 'AL0010005',
    missaoId: 'MS003',
    dataSolicitacao: new Date('2025-10-15'),
    dataFim: new Date('2025-10-22'),
    status: 'pendente',
  },
  {
    alunoId: 'AL0020001',
    missaoId: 'MS002',
    dataSolicitacao: new Date('2025-10-18'),
    dataFim: new Date('2025-10-25'),
    status: 'em-progresso',
  },
  // ... adicionar mais conflitos conforme necessário
]

/**
 * Funções utilitárias para filtrar dados
 */
export function getTurmaById(id: string): Turma | undefined {
  return turmasMock.find((t) => t.id === id)
}

export function getMissaoById(id: string): Missao | undefined {
  return missoesMock.find((m) => m.id === id)
}

export function getAlunosByTurmaId(turmaId: string): Aluno[] {
  return alunosMock.filter((a) => a.turmaId === turmaId)
}

export function getConflitos(turmaId: string, missaoId: string): EnvioAnterior[] {
  const alunos = getAlunosByTurmaId(turmaId)
  const alunosIds = alunos.map((a) => a.id)
  return enviosaAnterioresMock.filter((e) => alunosIds.includes(e.alunoId) && e.missaoId === missaoId)
}

/**
 * Simular envio de missão em lote
 */
export async function simularEnvioBatch(
  turmaId: string,
  missaoId: string,
  dataInicio: Date,
  dataFim: Date,
): Promise<{
  batchId: string
  total: number
  sucesso: number
  falha: number
  tempoMs: number
}> {
  const alunos = getAlunosByTurmaId(turmaId)
  const tempoInicio = Date.now()

  // Simular delay de envio (1ms por aluno)
  await new Promise((resolve) => setTimeout(resolve, Math.min(alunos.length, 5000)))

  const tempoFim = Date.now()
  const taxaSucesso = 0.95 + Math.random() * 0.05 // 95-100%

  return {
    batchId: `BTH-${new Date().toISOString().split('T')[0]}-${Math.random().toString(36).substring(7).toUpperCase()}`,
    total: alunos.length,
    sucesso: Math.floor(alunos.length * taxaSucesso),
    falha: Math.ceil(alunos.length * (1 - taxaSucesso)),
    tempoMs: tempoFim - tempoInicio,
  }
}
