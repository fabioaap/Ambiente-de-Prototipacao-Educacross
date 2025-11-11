# 03 — Arquitetura Limpa e Testável (Robert C. Martin)

## Camadas

1. **Domínio** — regras de negócio puras.
2. **Aplicação** — casos de uso e orquestração.
3. **Infraestrutura** — frameworks, adaptadores e I/O.
4. **Interface** — UI, APIs e gateways.

## Regras

- Dependências sempre apontam para o núcleo (domínio).
- Nenhuma lógica de negócio depende de frameworks.
- Cada camada testável isoladamente.
- Portas/adaptadores permitem experimentação segura.

## Exemplo de estrutura

```
src/
├── domain/           # Regras de negócio puras
│   ├── entities/
│   ├── value-objects/
│   └── repositories/  # Interfaces (portas)
├── application/      # Casos de uso
│   ├── use-cases/
│   └── services/
├── infrastructure/   # Implementações (adaptadores)
│   ├── database/
│   ├── external-apis/
│   └── cache/
└── interface/        # UI, APIs, CLI
    ├── web/
    ├── api/
    └── cli/
```

## Princípios SOLID

- **S**ingle Responsibility
- **O**pen/Closed
- **L**iskov Substitution
- **I**nterface Segregation
- **D**ependency Inversion

## Testes por camada

- **Domínio:** Testes unitários puros (sem mocks)
- **Aplicação:** Testes de casos de uso (mocks de repositórios)
- **Infraestrutura:** Testes de integração (banco real ou testcontainers)
- **Interface:** Testes e2e (Playwright)
