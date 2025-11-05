# Preflight Doctor - PowerShell
param(
    [string[]]$Ports = @(5173, 4173, 6006, 3000),
    [switch]$Fix
)

Write-Host "[Preflight Doctor] Iniciando diagnóstico..." -ForegroundColor Cyan

# 1. Verificar portas ocupadas
foreach ($port in $Ports) {
    $used = netstat -ano | Select-String ":$port "
    if ($used) {
        Write-Host "Porta $port ocupada. Tentando identificar processo..." -ForegroundColor Yellow
        $procId = ($used -split '\s+')[-1]
        $proc = Get-Process -Id $procId -ErrorAction SilentlyContinue
        if ($proc) {
            Write-Host "Processo: $($proc.ProcessName) (PID: $procId)"
            if ($Fix) {
                Write-Host "Encerrando processo $procId..." -ForegroundColor Red
                Stop-Process -Id $procId -Force
            }
        }
        else {
            Write-Host "PID $procId não encontrado."
        }
    }
    else {
        Write-Host "Porta $port livre." -ForegroundColor Green
    }
}

# 2. Limpar cache de build
$cacheDirs = @(
    "node_modules/.vite",
    ".next",
    ".turbo"
)
foreach ($dir in $cacheDirs) {
    if (Test-Path $dir) {
        Write-Host "Limpando cache: $dir" -ForegroundColor Yellow
        if ($Fix) { Remove-Item -Recurse -Force $dir }
    }
}

# 3. Validar dependências
if (Test-Path "package.json") {
    Write-Host "Validando dependências npm..." -ForegroundColor Cyan
    try {
        npm ls --depth=0 | Out-Null
    }
    catch {
        Write-Host "Dependências desatualizadas. Rodando npm install..." -ForegroundColor Yellow
        if ($Fix) { npm install }
    }
}

Write-Host "[Preflight Doctor] Diagnóstico concluído." -ForegroundColor Cyan
