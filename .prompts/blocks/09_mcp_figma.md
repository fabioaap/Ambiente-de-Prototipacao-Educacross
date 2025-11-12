//Bloco 1 • Instruções do agente MCP Figma para pagina vanilla com fidelidade visual maxima

TITULO
Execucao consolidada MCP Figma para pagina vanilla pixel perfect

CONTEXTO
Estou no Figma desktop com servidor MCP Figma local ativo. Ha um Frame alvo visivel. O agente deve executar tudo em uma passada, sem perguntas. Em todas as chamadas incluir clientFrameworks: vanilla e clientLanguages: html,css.

FERRAMENTAS PERMITIDAS
mcp_figma_get_design_context
mcp_figma_get_metadata
mcp_figma_get_variable_defs
mcp_figma_get_code_connect_map
mcp_figma_get_screenshot  somente para auditoria ao final

PARAMETROS PROIBIDOS
Nao usar forceCode nem parametros nao listados.

POLITICA DE EXECUCAO
* Nao fazer perguntas
* Nao anunciar passos futuros
* Nao salvar nem anunciar arquivos parciais
* Nao aplicar interatividade  apenas responsividade derivada de constraints
* Nao chamar screenshot antes de concluir IR HTML e CSS

ORDEM OBRIGATORIA
1  mcp_figma_get_metadata no Frame alvo para obter ids dos filhos diretos em ordem de empilhamento
2  Para cada id coletar subarvore com mcp_figma_get_design_context e acumular os nos em memoria
   * Se a selecao falhar usar node id do link do Figma
   * Converter node id do formato com traco do URL para o formato com dois pontos aceito pela API
3  mcp_figma_get_variable_defs uma unica vez para tokens de cores tipografia espacamento e raio
4  mcp_figma_get_code_connect_map se existir e anexar componentKey e variantProps em Instances
5  Consolidar todos os parciais em UM IR completo validado
6  Emitir as saidas em TRES blocos na mesma resposta
   * IR  JSON valido
   * HTML unico sem estilos inline
   * CSS unico com custom properties e regras de flex e grid

REGRAS DE MAPEAMENTO
* Auto layout vira display flex com direction gap padding justify align
* Layout grid e guias de layout viram CSS Grid com colunas linhas e gaps equivalentes
* Constraints definem largura altura e ancoragens responsivas em relacao ao pai
* Variaveis do Figma viram custom properties em :root e sao referenciadas nas classes
* Para Instances usar componentKey e variantProps e quando houver props do Code Connect como referencia

CONTRATO DO IR
pageName  string
tokens  objeto com groups colors typography spacing radius  cada item com name var value
nodes  array na ordem de empilhamento
  k  Frame AutoLayout Instance Text Vector
  name  string
  componentKey  string ou nulo
  variantProps  objeto ou nulo
  layout  objeto ou nulo  dir gap pad [topo direita base esquerda] justify align
  grid  objeto ou nulo
  constraints  objeto ou nulo
  styleRefs  objeto ou nulo  fillVar textVar
  textContent  string ou nulo
  children  array

VALIDACOES ANTES DE EMITIR
* Contagem de nos do IR igual a contagem total do Frame
* Todo no com auto layout tem dir gap e padding definidos  zero quando ausente
* Todo texto tem fonte e tamanho vindos de variavel ou valor absoluto
* Se algum filho direto faltar repetir a coleta  registrar pendencias somente quando leitura for impossivel

SAIDAS
Emitir exatamente
1  IR
2  HTML
3  CSS
Sem qualquer outro texto

AUDITORIA VISUAL OPCIONAL
* Depois de emitir IR HTML e CSS chamar mcp_figma_get_screenshot uma unica vez para conferencia rapida sem OCR


//Bloco 2 • Validador de IR HTML e CSS

TITULO
Validador de IR HTML e CSS

OBJETIVO
Validar em uma passada a qualidade do IR HTML e CSS gerados a partir do MCP Figma para a pagina unica com fidelidade visual maxima

ENTRADAS ESPERADAS
* ir_json  objeto IR completo conforme contrato salvo
* html_str  documento unico em string
* css_str   folha unica em string
* opcional  expectedNodeCount  inteiro vindo do design context para checagem de contagem

REGRAS
* Nao fazer perguntas
* Executar todas as verificacoes e retornar um relatorio unico com pass e fail
* Se alguma entrada nao existir  marcar como falha e seguir com as demais

CHECKS
1  Esquema do IR
   * pageName e tokens presentes
   * nodes e children presentes
2  Contagem de nos
   * se expectedNodeCount informado  total de nos no IR deve ser igual
3  Auto layout
   * todo no com layout precisa ter dir gap pad justify align
   * css precisa conter ao menos uma declaracao display flex
4  Grid
   * se grid existir em algum no  css deve conter display grid ou grid template
5  Texto
   * todo no com textContent precisa de styleRefs textVar ou fonte e tamanho absolutos
6  Variaveis e tokens
   * para cada token do IR  css deve conter a variavel correspondente em root
7  HTML sem estilos inline
   * nao pode haver atributo style no html
8  Constraints
   * se constraints existir  css deve conter ao menos uma regra de largura ou altura controlada e ancoragem coerente
9  Duplicidades
   * ids duplicados em html nao sao permitidos

SAIDA
* Objeto JSON com
  summary  totais de pass e fail
  errors   lista descritiva
  warnings avisos
  tips     sugestoes de correcao

//Bloco 3 • Script Node do validador

// ir_html_css_check.js
export function runChecks({ ir_json, html_str, css_str, expectedNodeCount }) {
  const errors = [];
  const warnings = [];
  const tips = [];
  if (!ir_json || !html_str || !css_str) {
    errors.push("Entradas ir_json, html_str e css_str sao obrigatorias");
    return finish();
  }

  // 1 Esquema do IR
  if (!ir_json.pageName) errors.push("IR sem pageName");
  if (!ir_json.nodes || !Array.isArray(ir_json.nodes)) errors.push("IR sem nodes");
  if (!ir_json.tokens) warnings.push("IR sem tokens");

  // util
  const walk = (n, acc = []) => {
    if (!n) return acc;
    if (Array.isArray(n)) { n.forEach(x => walk(x, acc)); return acc; }
    acc.push(n);
    if (n.children) walk(n.children, acc);
    return acc;
  };
  const allNodes = walk(ir_json.nodes);

  // 2 Contagem
  if (typeof expectedNodeCount === "number" && expectedNodeCount !== allNodes.length) {
    errors.push(`Contagem de nos divergente IR ${allNodes.length} esperado ${expectedNodeCount}`);
  }

  // 3 Auto layout
  let needsFlex = false;
  allNodes.forEach(n => {
    if (n.layout) {
      needsFlex = true;
      const L = n.layout;
      ["dir","gap","pad","justify","align"].forEach(k => {
        if (!(k in L)) errors.push(`No ${n.name || n.k} sem campo de layout ${k}`);
      });
      if (Array.isArray(L.pad) && L.pad.length !== 4) {
        errors.push(`Padding de ${n.name || n.k} deve ter 4 valores`);
      }
    }
  });
  if (needsFlex && !/display\s*:\s*flex/i.test(css_str)) {
    errors.push("CSS sem regra display flex apesar de haver auto layout no IR");
  }

  // 4 Grid
  const hasGridNode = allNodes.some(n => n.grid);
  if (hasGridNode && !(/display\s*:\s*grid/i.test(css_str) || /grid-template/i.test(css_str))) {
    errors.push("CSS sem grid apesar de haver grid no IR");
  }

  // 5 Texto
  const textNodes = allNodes.filter(n => typeof n.textContent === "string");
  textNodes.forEach(n => {
    const hasVar = n.styleRefs && (n.styleRefs.textVar || n.styleRefs.fillVar);
    const hasAbs = n.style && (n.style.fontSize || n.style.fontFamily);
    if (!hasVar && !hasAbs) {
      errors.push(`Texto em ${n.name || "no"} sem variavel de tipografia nem valores absolutos`);
    }
  });

  // 6 Variaveis e tokens
  const tokenVars = [];
  const pick = obj => Array.isArray(obj) ? obj : [];
  const T = ir_json.tokens || {};
  ["colors","typography","spacing","radius"].forEach(group => {
    pick(T[group]).forEach(tok => {
      if (tok.var) tokenVars.push(tok.var);
    });
  });
  const rootBlock = css_str.match(/:root\s*\{([\s\S]*?)\}/i);
  if (tokenVars.length && !rootBlock) {
    errors.push("CSS sem bloco :root para variaveis");
  } else if (rootBlock) {
    const block = rootBlock[1];
    tokenVars.forEach(v => {
      const cssVar = v.startsWith("--") ? v : `--${v.replace(/[^a-z0-9_-]/gi,"").toLowerCase()}`;
      if (!new RegExp(`${cssVar}\\s*:`,"i").test(block)) {
        warnings.push(`Variavel ${cssVar} nao encontrada em :root`);
      }
    });
  }

  // 7 HTML sem estilos inline
  if (/style\s*=/.test(html_str)) errors.push("HTML contem estilos inline");

  // 8 Constraints heuristica
  const hasConstraints = allNodes.some(n => n.constraints);
  if (hasConstraints && !/(width|height)\s*:\s*(\d+px|auto|100%)/i.test(css_str)) {
    warnings.push("Constraints presentes mas nao ha indicios de regras de largura ou altura no CSS");
    tips.push("Mapear constraints para regras de largura altura e ancoragem");
  }

  // 9 Duplicidades de id
  const ids = [...html_str.matchAll(/id\s*=\s*["']([^"']+)["']/g)].map(m => m[1]);
  const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
  if (dup.length) errors.push(`Ids duplicados no HTML: ${[...new Set(dup)].join(", ")}`);

  return finish();

  function finish() {
    const summary = {
      totalChecks: 9,
      pass: errors.length === 0 ? 9 : Math.max(0, 9 - errors.length),
      fail: errors.length
    };
    return { summary, errors, warnings, tips };
  }
}
