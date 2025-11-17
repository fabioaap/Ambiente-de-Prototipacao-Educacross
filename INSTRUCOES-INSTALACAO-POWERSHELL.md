# 🔧 Instruções para Instalar PowerShell 7+

## ⚠️ Problema Identificado

O ambiente de prototipação Educacross requer **PowerShell 7+** para executar todos os scripts de validação, desenvolvimento e automação. Atualmente, o sistema possui apenas o Windows PowerShell 5.1 legado.

## 🎯 Soluções (Escolha uma)

### ✅ Opção 1: Instalação Automática (Recomendado)

1. **Localize o arquivo:** `instalar-powershell7.ps1` nesta pasta
2. **Clique com botão direito** no arquivo
3. **Selecione:** "Executar com PowerShell"
4. **Aguarde** a instalação concluir
5. **Feche TODOS os terminais** abertos (VS Code, PowerShell, CMD)
6. **Abra um novo terminal** e teste: `pwsh --version`

### ✅ Opção 2: Microsoft Store (Mais Simples)

1. Abra a **Microsoft Store**
2. Busque por **"PowerShell"**
3. Instale **PowerShell** (não "Windows PowerShell ISE")
4. Após instalação, feche e abra novos terminais
5. Teste: `pwsh --version`

### ✅ Opção 3: Winget (Windows 10/11 com App Installer)

Abra um terminal PowerShell ou CMD e execute:

```powershell
winget install --id Microsoft.Powershell --source winget
```

### ✅ Opção 4: Download Manual

1. Acesse: https://github.com/PowerShell/PowerShell/releases/latest
2. Baixe: `PowerShell-7.x.x-win-x64.msi` (ou `x86` se 32-bit)
3. Execute o instalador baixado
4. Siga as instruções na tela (aceitar padrões está OK)
5. Reinicie o terminal

## 🧪 Como Verificar se Funcionou

Após instalação, abra um **NOVO terminal** e execute:

```powershell
pwsh --version
```

**Resultado esperado:**
```
PowerShell 7.4.6 (ou superior)
```

## 🔧 Configurar VS Code (Opcional mas Recomendado)

Para que o VS Code use o PowerShell 7+ como padrão:

1. Pressione `Ctrl+Shift+P`
2. Digite: **"Terminal: Select Default Profile"**
3. Selecione: **"PowerShell"** (não "Windows PowerShell")
4. Abra um novo terminal no VS Code (`Ctrl + '`)
5. Verifique que está usando PowerShell 7: `pwsh --version`

Ou edite manualmente as configurações do VS Code:

```json
{
  "terminal.integrated.defaultProfile.windows": "PowerShell",
  "terminal.integrated.profiles.windows": {
    "PowerShell": {
      "source": "PowerShell",
      "icon": "terminal-powershell"
    }
  }
}
```

## ✅ Próximos Passos Após Instalação

Com PowerShell 7+ instalado, você poderá executar:

```powershell
# Verificar ambiente Node.js
npm run check-env

# Iniciar servidor de desenvolvimento (React)
npm run dev

# Iniciar Storybook
npm run storybook

# Servir HTMLs do Front-office/Back-office
python -m http.server 8080

# Validação estrutural Python
python universal_validator.py --path=. --output=json

# Verificar status do Git
git status

# Executar testes
npm run test
```

## 🐛 Troubleshooting

### Problema: Terminal ainda mostra "Windows PowerShell 5.1"

**Solução:** Você precisa **fechar TODOS os terminais** (incluindo no VS Code) e abrir novos. O PowerShell 7 não substitui as sessões já abertas.

### Problema: Comando `pwsh` não reconhecido

**Solução 1:** Reinicie o computador (garante que variáveis de ambiente sejam atualizadas)

**Solução 2:** Verifique PATH manualmente:
```powershell
$env:PATH -split ';' | Where-Object { $_ -like '*PowerShell*' }
```

Deve mostrar: `C:\Program Files\PowerShell\7\`

**Solução 3:** Execute diretamente:
```powershell
& "C:\Program Files\PowerShell\7\pwsh.exe" --version
```

### Problema: Política de execução bloqueia scripts

Execute como Administrador:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 📚 Documentação Oficial

- PowerShell 7 GitHub: https://github.com/PowerShell/PowerShell
- Documentação Microsoft: https://aka.ms/powershell-docs
- Guia de migração: https://aka.ms/powershell-migration

## 🆘 Suporte

Se nenhuma opção funcionar:

1. Verifique requisitos do sistema (Windows 7 SP1+ / Windows Server 2012+)
2. Consulte logs de instalação em: `%TEMP%\PowerShell-*-install.log`
3. Abra uma issue no GitHub do projeto ou contacte o time técnico

---

**Status:** Aguardando instalação do PowerShell 7+  
**Prioridade:** 🔴 Crítico - Bloqueia desenvolvimento  
**Tempo estimado:** 5-10 minutos  
