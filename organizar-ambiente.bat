@echo off
echo ========================================
echo ORGANIZADOR - Ambiente de Prototipacao
echo ========================================
echo.

set "BASE_DIR=%~dp0"
set "TARGET_DIR=%BASE_DIR%docs\ambiente-prototipacao"

echo Criando estrutura de pastas...
if not exist "%TARGET_DIR%" mkdir "%TARGET_DIR%"

echo.
echo Movendo arquivos...

if exist "%BASE_DIR%ambiente-index.html" (
    copy "%BASE_DIR%ambiente-index.html" "%TARGET_DIR%\index.html"
    echo [OK] index.html
) else (
    echo [X] ambiente-index.html nao encontrado
)

if exist "%BASE_DIR%ambiente-base.css" (
    copy "%BASE_DIR%ambiente-base.css" "%TARGET_DIR%\base.css"
    echo [OK] base.css
) else (
    echo [X] ambiente-base.css nao encontrado
)

if exist "%BASE_DIR%ambiente-styles.css" (
    copy "%BASE_DIR%ambiente-styles.css" "%TARGET_DIR%\styles.css"
    echo [OK] styles.css
) else (
    echo [X] ambiente-styles.css nao encontrado
)

if exist "%BASE_DIR%ambiente-script.js" (
    copy "%BASE_DIR%ambiente-script.js" "%TARGET_DIR%\script.js"
    echo [OK] script.js
) else (
    echo [X] ambiente-script.js nao encontrado
)

if exist "%BASE_DIR%AMBIENTE-README.md" (
    copy "%BASE_DIR%AMBIENTE-README.md" "%TARGET_DIR%\README.md"
    echo [OK] README.md
) else (
    echo [X] AMBIENTE-README.md nao encontrado
)

echo.
echo ========================================
echo Organizacao concluida!
echo ========================================
echo.
echo Pasta criada em:
echo %TARGET_DIR%
echo.
echo Para abrir a pagina:
echo 1. Navegue ate: docs\ambiente-prototipacao
echo 2. Abra: index.html
echo.
pause
