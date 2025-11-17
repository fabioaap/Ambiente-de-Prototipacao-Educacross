@echo off
echo ============================================
echo Instalador PowerShell 7+ - Educacross
echo ============================================
echo.

REM Verificar se winget existe
where winget >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [1/3] Instalando via winget...
    winget install --id Microsoft.Powershell --source winget --silent --accept-package-agreements --accept-source-agreements
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ============================================
        echo SUCESSO! PowerShell 7+ instalado via winget
        echo ============================================
        echo.
        echo Proximos passos:
        echo 1. Feche TODAS as janelas de terminal abertas
        echo 2. Abra um novo terminal
        echo 3. Execute: pwsh --version
        echo.
        pause
        exit /b 0
    )
)

echo [1/3] winget nao disponivel. Tentando metodo MSI...
echo.

REM Detectar arquitetura
if "%PROCESSOR_ARCHITECTURE%"=="AMD64" (
    set ARCH=x64
) else (
    set ARCH=x86
)

REM Baixar e instalar MSI
echo [2/3] Baixando PowerShell 7.4.6 para Windows %ARCH%...
set VERSION=7.4.6
set URL=https://github.com/PowerShell/PowerShell/releases/download/v%VERSION%/PowerShell-%VERSION%-win-%ARCH%.msi
set INSTALLER=%TEMP%\PowerShell-7-installer.msi

powershell -Command "Invoke-WebRequest -Uri '%URL%' -OutFile '%INSTALLER%' -UseBasicParsing"

if exist "%INSTALLER%" (
    echo.
    echo [3/3] Instalando PowerShell 7.4.6...
    msiexec /i "%INSTALLER%" /quiet /norestart ADD_EXPLORER_CONTEXT_MENU_OPENPOWERSHELL=1 ADD_FILE_CONTEXT_MENU_RUNPOWERSHELL=1 ADD_PATH=1
    
    echo.
    echo ============================================
    echo SUCESSO! PowerShell 7+ instalado
    echo ============================================
    echo.
    echo Proximos passos:
    echo 1. Feche TODAS as janelas de terminal abertas
    echo 2. Abra um novo terminal
    echo 3. Execute: pwsh --version
    echo 4. Deve mostrar: PowerShell 7.4.6
    echo.
    echo IMPORTANTE: Pode ser necessario REINICIAR o computador
    echo se o comando pwsh nao for reconhecido imediatamente.
    echo.
    
    del "%INSTALLER%" 2>nul
) else (
    echo.
    echo ============================================
    echo ERRO: Nao foi possivel baixar o instalador
    echo ============================================
    echo.
    echo Por favor, instale manualmente:
    echo.
    echo Opcao 1 - Microsoft Store:
    echo   1. Abra a Microsoft Store
    echo   2. Busque "PowerShell"
    echo   3. Clique em Instalar
    echo.
    echo Opcao 2 - Download Manual:
    echo   1. Acesse: https://github.com/PowerShell/PowerShell/releases/latest
    echo   2. Baixe: PowerShell-7.x.x-win-x64.msi
    echo   3. Execute o instalador
    echo.
)

pause
