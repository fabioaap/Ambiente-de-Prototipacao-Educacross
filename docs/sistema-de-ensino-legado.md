# Sistema de Ensino – Tela Legada (Livro A · Atividades Direcionadas de Matemática)

Este documento descreve o fluxo funcional, regras de negócio e estados de interface observados na tela legada usada como referência para o protótipo. A captura analisada corresponde ao contexto “Sistema de Ensino → A2 → Livro A · Atividades Direcionadas de Matemática”.

## Propósito da Tela

- Oferecer ao gestor da rede uma visão consolidada do desempenho das missões associadas ao Livro A.
- Permitir cortes por escola e unidade do livro, acompanhar indicadores de progresso e rendimento e acionar ações administrativas (relatórios, exportações, ajustes de missões).

## Atores e Perfis

- **Gestor de Redes** (principal): usuário autenticado responsável por acompanhar o desempenho das escolas da rede.
- **Outros perfis potenciais**: coordenadores pedagógicos ou analistas que recebem a tela em modo leitura. Não há evidência de permissões de edição além da exportação e ajustes por missão.

## Estrutura Geral

1. **Navegação lateral**  
   - Grupos de menu: Painel Inicial, Relatórios, Missões, Sistema de Ensino (seção ativa), Eventos, Avaliação Diagnóstica, Expedição Leitora, Cadastros, Ajudas e Materiais.
   - Cada item leva a módulos distintos; apenas “Sistema de Ensino” está ativo na captura.

2. **Cabeçalho superior**  
   - Identidade da rede (“Rede Nacional Encantada”) e atalho para o perfil do usuário logado (nome + cargo “Gestor de Redes”).
   - Menu hambúrguer exibido apenas em resoluções menores (não visível em desktop padrão).

3. **Breadcrumb e Tabs**  
   - Breadcrumb reforça a hierarquia: Sistema de Ensino → A2 → Livro A.  
   - Abas: Livros (ativa), Escolas, Ranking. Mudam as métricas apresentadas mantendo o mesmo contexto do livro.

4. **Metadados do Contexto**  
   - Badge “6º ano” (série do livro).  
   - Chamada “Livro A · Atividades Direcionadas de Matemática”.  
   - Botão “Relatório do livro” (gera PDF ou página detalhada).  
   - Tag com o nome da rede ativa.

5. **Filtros primários**  
   - `Escola`: default “Todas as escolas”.  
   - `Unidades do livro`: default “Todas as unidades do livro”.  
   - Ambos são combobox simples (provável lista carregada da API) e recarregam os indicadores ao alterar valores.

6. **Indicadores (cards)**  
   - **Progresso médio**  
     - Métricas: “Em missões totais” (20%), “Em missões enviadas” (100%).  
     - Texto auxiliar: “21.600 missões enviadas / 108.000 missões totais”.
   - **Alunos que jogaram**  
     - Percentual (74%) + badge de status “Moderado” (laranja).  
     - Interpretação: cobertura dos alunos elegíveis.
   - **Rendimento médio**  
     - Percentual de acertos (95%) + badge “Avançado” (verde).  
   - **Tempo total investido**  
     - Valor acumulado “262h 29min 20s”.  
   - **Total de desafios realizados**  
     - Contagem “300.800”.
   - Todos seguem padrão de título, ícone e texto de apoio; barras de progresso variam de cor conforme status.

7. **Tabela de Missões**  
   - Campos:
     - `Missão`: nome da unidade + marcador “Missão Plus” quando aplicável.
     - `Uso na rede`: total de turmas que utilizaram versus total disponível (ex.: 15 de 30).
     - `Progresso`: barra colorida + percentual + rótulo textual (Finalizado, Crítico, Moderado, Não iniciado).
     - `Ações`: engrenagem (abre drawer/modal de ajustes).
   - Controles adicionais:
     - Seleção de page size (10/20/50) e busca textual (“Pesquisar por missão”).
     - Botão `Exportar em Excel`.
   - Rodapé informa paginação (“Exibindo 1 a 10 de 20 entradas”) e paginator numérico (1, 2).

8. **Legenda de Status**  
   - Progresso: mapeamento das cores para faixas (≥100% finalizado, ≥80% satisfatório, ≥50% moderado, ≤50% crítico, cinza para não iniciado).
   - Rendimento: faixas percentuais para avançado/proficiente/básico/abaixo do básico.

9. **Rodapé institucional**  
   - Direitos autorais e ícones de redes sociais.

## Fluxo do Usuário (Happy Path)

1. Usuário acessa o módulo “Sistema de Ensino” e escolhe o livro desejado via navegação prévia (breadcrumb reflete a seleção).  
2. Revê o contexto: série, rede e botão de relatório.  
3. Ajusta filtros de `Escola` e `Unidades do livro` conforme necessidade (cada mudança refresca indicadores).  
4. Analisa os cinco cards para entender panorama (progresso, cobertura, rendimento, tempo, desafios).  
5. Usa busca ou paginação para localizar uma missão específica.  
6. Consulta o progresso e uso de cada missão; clica na engrenagem para ajustar/configurar (abrir drawer/ modal legado).  
7. Exporta a visão atual para Excel quando necessário.  
8. (Opcional) Navega para abas “Escolas” ou “Ranking” para perspectivas alternativas.

## Regras de Negócio Inferidas

### Indicadores

- **Progresso médio**  
  - `Em missões totais (%) = missões concluídas / total de missões disponíveis`.  
  - `Em missões enviadas (%) = missões enviadas / total de missões enviadas` (valor tende a 100% quando todo o lote foi disparado).  
  - Totais exibidos empregam separador de milhar e unidade “missões”.

- **Alunos que jogaram**  
  - Percentual representa alunos únicos que executaram ao menos uma missão no período corrente.  
  - Status textual deriva de faixas (estimadas):  
    - Avançado ≥ 90%  
    - Moderado entre 60% e 80% (na captura: 74%)  
    - Crítico < 50%  
    - (confirmar em integração futura).

- **Rendimento médio**  
  - Percentual de acertos médio das missões da rede.  
  - Legendas: Avançado ≥ 70%, Proficiente ≥ 50%, Básico ≥ 25%, Abaixo do Básico < 25%.

- **Tempo total investido**  
  - Soma de `tempo_jogado` em horas/minutos/segundos por missão e aluno.  
  - Formatação HHh MMmin SSs.

- **Total de desafios realizados**  
  - Conta a quantidade total de tentativas (desafios) concluídas.

### Tabela de Missões

- **Uso na rede** = `turmas que receberam ou jogaram a missão / total de turmas previstas para o livro`.  
- **Progresso (%)** = `missões concluídas / total de missões para a unidade`.  
- **Status textual e cor**:  
  - Finalizado (verde) quando progresso = 100%.  
  - Satisfatório (verde claro) entre 80% e 99%.  
  - Moderado (laranja) entre 50% e 79%.  
  - Crítico (vermelho) ≤ 49%.  
  - Não iniciado (cinza) = 0%.  
- **Missão Plus**: flag para missões premium/diferenciadas; deve aparecer ao lado do título.  
- **Ações**: engrenagem abre painel de configurações (no legado era um drawer lateral). Funções comuns: reemitir missão, editar prazo, visualizar estatísticas específicas.

### Filtros e Consultas

- Alterar filtros reseta paginação para a primeira página e recalcula indicadores/tabela.  
- Busca por missão realiza filtro pelo título (case-insensitive, partial match).  
- Exportar em Excel respeita filtros, ordenação e colunas visíveis.

### Paginação

- Contagem informada em rodapé precisa acompanhar o resultado atual (“1 a 10 de 20”).  
- Botões numéricos indicam página corrente (estilo preenchido) e navegação disponível.

## Requisitos Não Funcionais

- **Performance**: carregamento dos cards deve ocorrer em até 2s com caches aplicáveis; tabela suportar até 200 missões por book com paginação.  
- **Acessibilidade**: contraste das cores segue padrão AA; ícones possuem rótulo via `aria-label`.  
- **Observabilidade**: eventos a rastrear (legado): troca de filtro, clique em exportar, abertura de ação da missão, download de relatório.

## Dicionário de Dados (Campos-chave)

| Campo | Descrição | Tipo | Fonte | Observações |
| --- | --- | --- | --- | --- |
| `bookId` | Identificador do livro | string | API Sistema de Ensino | Mantém relação com série/ano. |
| `schoolId` | Identificador da escola | string | Catálogo escolas | `null` representa todas. |
| `unitId` | Identificador da unidade (capítulo) | string | Catálogo de unidades | `null` representa todas. |
| `missionsTotal` | Missões totais disponíveis | number | Motor de missões | Usado nos percentuais. |
| `missionsSent` | Missões enviadas | number | Motor de missões | 1 envio por turma. |
| `studentsPlayed` | % alunos que jogaram | number (0-100) | Analytics de jogadas | Valor arredondado. |
| `avgAccuracy` | % de acertos da rede | number (0-100) | Analytics de jogadas | Base para status de rendimento. |
| `timeSpent` | Tempo total investido | number (segundos) | Analytics | Formatação no front. |
| `challengesSolved` | Desafios realizados | number | Analytics | Inteiro com separador de milhar. |
| `missionUsage` | Turmas que usaram missão | number | Motor de missões | Mostrado como fração junto ao total. |
| `missionProgress` | Progresso da missão | number (0-100) | Analytics | Determina status. |
| `missionStatus` | Rótulo textual | string | Derivação front/back | Conforme faixas acima. |
| `missionIsPlus` | Flag Missão Plus | boolean | Catálogo de missões | Exibe badge roxa. |

## Lacunas e Perguntas Abertas

- Confirmar faixas exatas das badges de “Moderado”, “Avançado”, etc.  
- Validar se “Uso na rede” considera apenas turmas com alunos ativos ou todas as turmas.  
- Especificar origem do botão “Relatório do livro” (download de PDF ou navegação interna).  
- Definir se a exportação em Excel exige fila/async ou é síncrona.  
- Mapear endpoints do legado para garantir compatibilidade (não disponíveis na captura).

## Próximos Passos para o Protótipo

1. **Criar mocks** alinhados ao dicionário acima para alimentar o protótipo dinâmico.  
2. **Instrumentar eventos** (analytics) desde o início.  
3. **Documentar integrações** com APIs reais quando o backend estiver disponível.  
4. **Simplificar o fluxo de ações** da missão (engrenagem) para a versão prototipada inicial, priorizando a visualização de dados antes de liberar edições.
