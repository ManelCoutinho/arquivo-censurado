<div style="display: flex; align-items: center; gap: 16px; margin-bottom:1.5rem">
  <img src="chrome-extension/docs/logo512.png" alt="Logo do Arquivo Censurado" style="height: 80px">
  <h1>Arquivo Censurado – Web</h1>
</div>

O **Arquivo Censurado** é um projeto de investigação científica que visa estudar a capacidade de censura automática de modelos de linguagem de última geração. Desenvolvido no âmbito da iniciativa “50 anos do 25 de Abril” e inserido no Prémio Arquivo.PT 2025, promovido pela FCT e pelo Arquivo.PT.

## Arquitetura
O código que suporta o Arquivo Censurado está organizado em três componentes principais:

[Arquivo Censurado Chrome Extension](chrome-extension/) — Lógica de criação da extensão para Google Chrome que integra o Arquivo Censurado.

[Arquivo Censurado Web](web/) — Aplicação web desenvolvida com usando como stack tecnológica React.

[Arquivo Censurado Endpoint](package/) — API responsável por orquestrar as chamadas aos modelos de linguagem que executam a censura automatizada.
