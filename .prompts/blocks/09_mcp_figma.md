# Bloco 09 — MCP Figma para página vanilla com saída pixel perfect

## Objetivo
Gerar a página ativa do Figma como HTML e CSS vanilla com máxima fidelidade visual usando somente dados do MCP do Figma e, quando disponível, exemplos do Code Connect. Não fazer perguntas. Executar em uma passada.

## Regras de Conduta
1. **Não pedir confirmação nem fazer perguntas**. Assumir valores padrão quando o dado não existir.
2. **Usar apenas as ferramentas do MCP do Figma** para ler conteúdo do arquivo. Ler somente a página visível.
3. Se houver Code Connect no Dev Mode, usar os exemplos oficiais de uso de componentes apenas como referência de propriedades e estados.
4. **Respeitar variáveis do Figma como fonte de tokens.** Aplicar como custom properties de CSS.
5. **Garantir estrutura semântica e acessível.** Preferir tags nativas HTML antes de `div`.
6. Otimizar para fidelidade visual. Medir e reproduzir `gap`, `padding`, alinhamentos, grids e constraints.
7. **Saída final em três blocos: IR, HTML, CSS.** Não retornar nada além desses blocos.

## Fluxo de Trabalho
**A. Coleta via MCP**

1. Obter nome da página ativa.
2. Coletar variáveis ativas e modos de cor e tipografia.
3. Listar nós relevantes da página na ordem de empilhamento. Priorizar Frame, AutoLayout, Instance, Text, Vector.
4. Para cada nó, capturar propriedades de auto layout (padding, item spacing, alinhamentos), layout guides e constraints. Capturar também referências de variáveis ligadas.
5. Quando o nó for Instance, coletar chave de componente e variantes. Se Code Connect estiver presente, anotar props e estados usados nos exemplos.
6. Montar o IR conforme o esquema de `emit_ir` e chamar a função `emit_ir`.

**B. Geração**

1. Transformar IR em HTML com marcação semântica:
   - Auto layout → `display:flex`, direção, gap, padding, `justify`, `align`.
   - Layout guide → CSS Grid quando aplicável.
   - Constraints → regras de redimensionamento e posicionamento.
2. Produzir CSS usando custom properties para tokens de cores, tipografia, raio, espaço e demais variáveis. Incluir reset mínimo e utilitários necessários.
3. Garantir classes claras por nó raiz de cada bloco lógico. Evitar estilos inline.

## Esquema da Função `emit_ir`

```yaml
name: emit_ir
description: Devolve o IR da página ativa
parameters:
  type: object
  required: [pageName, nodes, tokens]
  properties:
    pageName: { type: string }
    tokens:
      type: object
      properties:
        colors: { type: array, items: { type: object, properties: { name:{type:string}, var:{type:string}, value:{type:string} } } }
        typography: { type: array, items: { type: object, properties: { name:{type:string}, var:{type:string}, weight:{type:number}, size:{type:number}, lineHeight:{type:number} } } }
        spacing: { type: array, items: { type: object, properties: { name:{type:string}, var:{type:string}, value:{type:number} } } }
        radius: { type: array, items: { type: object, properties: { name:{type:string}, var:{type:string}, value:{type:number} } } }
    nodes:
      type: array
      items:
        type: object
        required: [k, name, children]
        properties:
          k: { type: string, enum: ["Frame","AutoLayout","Instance","Text","Vector"] }
          name: { type: string }
          componentKey: { type: ["string","null"] }
          variantProps: { type: ["object","null"], additionalProperties: { type:"string"} }
          layout:
            type: ["object","null"]
            properties:
              dir: { type: string, enum: ["row","column"] }
              gap: { type: number }
              pad: { type: array, items: { type: number }, minItems:4, maxItems:4 }
              justify: { type: string }
              align: { type: string }
          grid: { type: ["array","null"] }
          constraints: { type: ["object","null"] }
          styleRefs:
            type: ["object","null"]
            properties:
              fillVar: { type: ["string","null"] }
              textVar: { type: ["string","null"] }
          textContent: { type: ["string","null"] }
          children: { type: array }
```

## Validação antes de Gerar

1. Conferir contagem de nós do IR com a contagem vinda do MCP para a página.
2. Verificar que todo nó com auto layout possui gap e padding definidos, mesmo que zero.
3. Verificar que todo texto possui fonte e tamanho, vindos de variável ou valor absoluto.
4. Se faltar dado crítico, estimar com base nos irmãos e marcar em uma lista de pendências no fim.

## Saídas

1. **IR** – Conteúdo JSON exatamente no formato recebido por `emit_ir`.
2. **HTML** – Documento completo com estrutura semântica. Usar classes que reflitam a hierarquia do IR. Nenhum estilo inline.
3. **CSS** – Arquivo com variáveis CSS a partir de tokens do IR e regras para flex e grid. Incluir media queries quando constraints exigirem.

## Critérios de Fidelidade

- Alinhamento e distribuição iguais aos valores do IR.
- Gaps e paddings iguais aos informados.
- Tipografia mapeada por variável quando existir.
- Cores vindas de variáveis aplicadas como custom properties.
- Resposta visual a redimensionamento conforme constraints e layout guide.

## Checklist Final

- Sem perguntas.
- Apenas três blocos na saída (IR, HTML e CSS).
- IR válido no schema.
- HTML semântico e acessível.
- CSS com variáveis e sem estilos inline.
- Lista de pendências, se houver.
