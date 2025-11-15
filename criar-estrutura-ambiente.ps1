# Script para criar a estrutura da página do Ambiente de Prototipação

$baseDir = "C:\Users\Educacross\Documents\Educacross\Ambiente de Prototipação Educacross\docs\ambiente-prototipacao"

# Criar diretório se não existir
if (!(Test-Path $baseDir)) {
    New-Item -ItemType Directory -Path $baseDir -Force
    Write-Host "Pasta criada: $baseDir" -ForegroundColor Green
}

Write-Host "Estrutura criada com sucesso!" -ForegroundColor Green
Write-Host "Acesse: $baseDir" -ForegroundColor Cyan
