# Script para abrir o protótipo no navegador
$basePath = Split-Path -Parent $MyInvocation.MyCommand.Path
$htmlFile = Join-Path $basePath "Back-office\Gerador de Questões por IA – BackOffice\criar-nova-questao.html"

Write-Host "Tentando abrir: $htmlFile"

if (Test-Path $htmlFile) {
    Write-Host "✅ Arquivo encontrado!"
    Start-Process $htmlFile
    Write-Host "✅ Arquivo aberto no navegador padrão"
}
else {
    Write-Host "❌ Arquivo não encontrado em: $htmlFile"
    Write-Host ""
    Write-Host "Listando arquivos no diretório Back-office:"
    Get-ChildItem "$basePath\Back-office" -Recurse -Filter "*.html" | Select-Object FullName
}
