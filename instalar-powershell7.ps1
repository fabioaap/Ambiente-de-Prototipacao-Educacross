# Script para instalar PowerShell 7+
# Execute este script clicando com botão direito > "Executar com PowerShell"

Write-Host "=== Instalador do PowerShell 7+ ===" -ForegroundColor Cyan
Write-Host ""

# Método 1: Usando winget (Windows 10/11 com App Installer)
Write-Host "Tentando instalar via winget..." -ForegroundColor Yellow
try {
    winget install --id Microsoft.Powershell --source winget --accept-package-agreements --accept-source-agreements
    Write-Host "✅ PowerShell 7+ instalado com sucesso via winget!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 Próximos passos:" -ForegroundColor Cyan
    Write-Host "1. Feche esta janela"
    Write-Host "2. Abra um novo terminal (PowerShell 7 ou VS Code terminal)"
    Write-Host "3. Execute: pwsh --version"
    Write-Host ""
    pause
    exit 0
}
catch {
    Write-Host "⚠️  winget não disponível. Tentando método alternativo..." -ForegroundColor Yellow
}

# Método 2: Download direto via MSI
Write-Host ""
Write-Host "Baixando instalador MSI do PowerShell 7..." -ForegroundColor Yellow

$version = "7.4.6"
$arch = if ([Environment]::Is64BitOperatingSystem) { "x64" } else { "x86" }
$downloadUrl = "https://github.com/PowerShell/PowerShell/releases/download/v$version/PowerShell-$version-win-$arch.msi"
$installerPath = "$env:TEMP\PowerShell-7-installer.msi"

try {
    Write-Host "URL: $downloadUrl" -ForegroundColor Gray
    Invoke-WebRequest -Uri $downloadUrl -OutFile $installerPath -UseBasicParsing
    
    Write-Host "✅ Download concluído!" -ForegroundColor Green
    Write-Host "🚀 Iniciando instalação..." -ForegroundColor Yellow
    
    # Executar instalador MSI silenciosamente
    Start-Process msiexec.exe -ArgumentList "/i `"$installerPath`" /quiet /norestart ADD_EXPLORER_CONTEXT_MENU_OPENPOWERSHELL=1 ADD_FILE_CONTEXT_MENU_RUNPOWERSHELL=1 ADD_PATH=1" -Wait
    
    Write-Host ""
    Write-Host "✅ PowerShell 7+ instalado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 Próximos passos:" -ForegroundColor Cyan
    Write-Host "1. Feche TODOS os terminais abertos (VS Code, PowerShell, etc.)"
    Write-Host "2. Abra um novo terminal"
    Write-Host "3. Execute: pwsh --version"
    Write-Host "4. Você deve ver: PowerShell 7.4.6 ou superior"
    Write-Host ""
    Write-Host "💡 Dica: No VS Code, pressione Ctrl+Shift+P e digite 'Terminal: Select Default Profile'"
    Write-Host "         Escolha 'PowerShell' (não 'Windows PowerShell')" -ForegroundColor Gray
    Write-Host ""
    
    # Limpar arquivo temporário
    Remove-Item $installerPath -ErrorAction SilentlyContinue
}
catch {
    Write-Host ""
    Write-Host "❌ Erro durante instalação automática." -ForegroundColor Red
    Write-Host "Por favor, instale manualmente:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Opção 1 (Recomendado):" -ForegroundColor Cyan
    Write-Host "  1. Abra a Microsoft Store"
    Write-Host "  2. Busque por 'PowerShell'"
    Write-Host "  3. Instale 'PowerShell' (não 'Windows PowerShell ISE')"
    Write-Host ""
    Write-Host "Opção 2 (Manual):" -ForegroundColor Cyan
    Write-Host "  1. Acesse: https://github.com/PowerShell/PowerShell/releases/latest"
    Write-Host "  2. Baixe: PowerShell-7.x.x-win-x64.msi"
    Write-Host "  3. Execute o instalador"
    Write-Host ""
    Write-Host "Erro detalhado: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host ""
pause
