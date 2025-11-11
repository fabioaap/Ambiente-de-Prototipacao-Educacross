# Jornada do Aluno - Plataforma de Jogos

## 👤 Persona
- **Nome:** Ana Silva
- **Idade:** 13 anos
- **Série:** 7º Ano
- **Objetivo:** Jogar, aprender e ganhar pontos
- **Motivação:** Competição com colegas, prêmios, diversão

## 🎯 Objetivo da Jornada
Oferecer experiência gamificada onde alunos completam missões, ganham pontos e competem.

## 📋 Fluxo Principal

### 1️⃣ **Login do Aluno**
- [ ] Aluno acessa plataforma
- [ ] Login com credenciais escolares (LDAP)
- [ ] Página inicial carrega com:
  - Avatar personalizado
  - Pontos totais
  - Ranking na turma
  - Missões disponíveis

### 2️⃣ **Visão Geral - Home**
Card com status:
- **Pontos Totais:** X pontos
- **Ranking:** 5º lugar na turma
- **Missões em Progresso:** 3
- **Próxima Meta:** 200 pontos (para passar de nível)

Botões:
- [ ] "Ver Missões" (CTA principal)
- [ ] "Ver Ranking"
- [ ] "Meu Perfil"

### 3️⃣ **Catálogo de Missões**
Visualizar:
- [ ] **Abas:**
  - Disponíveis (novas missões do professor)
  - Em Progresso
  - Completadas
  - Expiradas

- [ ] **Card de Missão:**
  - Ícone/tema (Matemática, Português, História)
  - Título: "Desafio de Frações"
  - Descrição breve
  - Dificuldade: ⭐⭐⭐
  - Recompensa: +50 pontos
  - Prazo: "Até 15/11"
  - Botão: "Iniciar" ou "Continuar"

### 4️⃣ **Jogo/Missão em Andamento**
Dentro do jogo:
- [ ] Interface interativa (quiz, puzzle, etc)
- [ ] Feedback imediato (acerto/erro com explicação)
- [ ] Barra de progresso (X/10 questões respondidas)
- [ ] Contador de pontos (indica quanto vai ganhar)
- [ ] Botão "Pausar" e "Voltar"

### 5️⃣ **Conclusão da Missão**
- [ ] Tela de sucesso:
  - "🎉 Parabéns, Ana!"
  - Pontos ganhos: +50
  - Novo total: 1.250 pontos
  - Posição no ranking: 5º → 4º
  - Botão: "Próxima Missão"

### 6️⃣ **Ranking e Competição**
- [ ] Visualizar ranking da turma:
  - 1º lugar: João - 2.500 pts
  - 2º lugar: Maria - 2.300 pts
  - ...
  - Eu (5º): Ana - 1.250 pts

- [ ] Destaque "você está aqui"
- [ ] Botão "Desafiar" (enviar desafio a outro aluno)

### 7️⃣ **Perfil Pessoal**
- [ ] Avatar customizável
- [ ] Estatísticas:
  - Missões completadas: 15
  - Taxa de acerto: 92%
  - Pontos totais: 1.250
  - Nível: Ouro
- [ ] Badges/Conquistas (Rápido, Preciso, etc)
- [ ] Histórico de atividades

### 8️⃣ **Notificações**
- [ ] Alerta quando:
  - Nova missão enviada
  - Alguém passou na frente no ranking
  - Missão está prestes a expirar
  - Desafio de outro aluno
- [ ] Centro de notificações com histórico

## 📊 Critérios de Aceitação

| Critério | Tipo | Descrição |
|----------|------|-----------|
| **CA-1** | Funcional | Aluno consegue iniciar e completar missão |
| **CA-2** | Funcional | Pontos são atualizados corretamente |
| **CA-3** | Performance | Interface reage em < 100ms |
| **CA-4** | UX | Interface motivadora e intuitiva |
| **CA-5** | UX | Feedback claro de acerto/erro |
| **CA-6** | Gamificação | Ranking atualiza em tempo real |
| **CA-7** | Acessibilidade | WCAG AA+ compliance |
| **CA-8** | Mobile-First | Funciona perfeitamente em celular |
| **CA-9** | Motivação | Mantém engajamento (retention > 60%) |

## 🚀 Componentes Necessários

```
📦 Games Platform
├── StudentHome (Home com stats)
├── MissionCatalog (Catálogo de missões)
├── MissionGame (Interface do jogo)
├── SuccessModal (Tela de conclusão)
├── RankingBoard (Ranking da turma)
├── StudentProfile (Perfil pessoal)
├── NotificationCenter (Centro de notificações)
├── AvatarCustomizer (Personalização de avatar)
├── BadgeDisplay (Exibição de conquistas)
└── ScoreCounter (Contador de pontos animado)
```

## 🎨 Design System (Gamificado)

- **Cores Vibrantes:** Primary (#7367ef), Success (#28a745), Warning (#ff9800)
- **Animações:** Transições suaves, efeitos de pontos flutuantes
- **Tipografia:** Fonte amigável, tamanhos legíveis
- **Ícones:** Temáticos (medalhas, estrelas, troféus)
- **Tipologia de Cards:** Coloridos, com sombras, interativos

## 🔄 Fluxos Alternativos

### Cenário: Aluno errou a questão
- [ ] Feedback construtivo
- [ ] Dica para próxima tentativa
- [ ] Opção de "Tentar Novamente"
- [ ] Não perde pontos (apenas não ganha)

### Cenário: Missão expirou
- [ ] Aviso ao abrir app
- [ ] Missão move para "Expiradas"
- [ ] Opção de pedir ao professor para estender

### Cenário: Aluno está no meio da missão
- [ ] Sistema salva progresso
- [ ] Ao retornar, oferece "Continuar"
- [ ] Mantém pontos já conquistados

## 📱 Mockups de Telas

- [ ] Home com stats e missões disponíveis
- [ ] Catálogo de missões com filtros
- [ ] Interface de jogo quiz
- [ ] Tela de sucesso com animações
- [ ] Ranking da turma
- [ ] Perfil de aluno

## 🎯 Métricas de Sucesso

- **Engajamento:** > 70% dos alunos iniciando missões
- **Conclusão:** > 60% de taxa de conclusão
- **Retenção:** > 80% retornam em < 1 semana
- **Satisfação:** NPS > 8/10

## ✅ Status do Desenvolvimento

- **Planejamento:** ✅
- **Design:** ⏳ Em progresso
- **Prototipagem:** ⏳ Em fila
- **Implementação:** ⏳ Em fila
- **Testes (A/B):** ⏳ Em fila
- **Deploy:** ⏳ Em fila