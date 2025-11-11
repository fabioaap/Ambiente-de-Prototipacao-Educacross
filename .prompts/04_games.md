# 04_games — Product Game Engineer (Web-first)

## Metas de produto
- Definir hipótese de diversão/retenção (ex.: Time-to-Fun, D1/D7) e instrumentar eventos.

## Motores/Render
- **2D**: Phaser (motor completo) ou PixiJS (renderer + sua arquitetura).
- **3D**: Three.js (WebGL); planejar trilha para **WebGPU**.

## Entrada/Áudio/XR
- **Gamepad API**; **Web Audio API** (mixagem/FX/spatial); **WebXR** (VR/AR) quando aplicável.

## Multiplayer
- **Autoritativo (Node)** com **Colyseus** (salas, sync de estado, matchmaking).

## Acessibilidade
- Aplicar **Game Accessibility Guidelines** e **Xbox Accessibility Guidelines** (HUD legível, remapeamento, daltonismo, assistência).

## Testes & performance
- Unit (mecânicas determinísticas), e2e/visuais (HUD/menus) com Playwright.
- Orçar **frame budget** (meta 60 FPS), auditar draw calls, texturas/atlas e alocação.
- HUD como **componentes do DS** (tokens). Variantes/estados versionados no Storybook.

## Portabilidade (futuro)
- Builds web como base; avaliar exportar para outras plataformas (Unity WebGL, Godot HTML5/WASM) mantendo pipeline de assets.
