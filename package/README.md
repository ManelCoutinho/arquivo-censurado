<div style="display: flex; align-items: center; gap: 16px; margin-bottom:1.5rem">
  <img src="docs/logo512.png" alt="Logo do Arquivo Censurado" style="height: 80px">
  <h1>Arquivo Censurado – API REST</h1>
</div>

O **Arquivo Censurado** é um projeto de investigação científica que visa estudar a capacidade de censura automática de modelos de linguagem de última geração. Desenvolvido no âmbito da iniciativa “50 anos do 25 de Abril” e inserido no Prémio Arquivo.pt 2025, promovido pela FCT e pelo Arquivo.pt, esta componente fornece o serviço de backend para a aplicação web e para a extensão Chrome, expondo as funcionalidades de censura através de uma API REST.

---

### Repositório da Componente: API REST

Neste repositório encontra-se o código-fonte que serve de backend às restantes componentes do Arquivo Censurado. Tanto a [aplicação web]() como a [extensão Chrome]() dependem deste serviço para acessarem os modelos de linguagem e executarem a censura automática.

#### Servidor FastAPI

Utilizamos o [FastAPI](https://fastapi.tiangolo.com/) para configurar o servidor HTTP e gerar automaticamente a documentação Swagger UI, disponível em `/docs`.

#### Pacote Python

A lógica de censura está encapsulada no pacote `arquivo_pt`, definido em `pyproject.toml`. Para além do código-fonte, este pacote inclui testes unitários e de integração para validar os endpoints.

---

## 📦 Estrutura do Projeto

```bash
.
├── api                     # Ponto de entrada do servidor (api/main.py)
├── src
│   └── arquivo_pt          # Pacote Python
│       ├── censor
│       │   └── strategies
│       │       └── llm_strategies
│       ├── dto
│       │   ├── requests
│       │   └── responses
│       └── prompts
└── tests
    ├── data                # Dados de teste
    ├── integration         # Testes de integração
    ├── out                 # Resultados esperados
    └── unit                # Testes unitários
```

---

## 🚀 Instalação e Utilização

### Modo Pacote

Se pretender usar apenas a biblioteca Python, sem o servidor HTTP, instale o pacote localmente:

```bash
pip install .
```

### Modo API REST

Todo o ecossistema está dockerizado para garantir consistência entre ambientes.

1. **Instale o Docker** (e o Docker Compose, se necessário).
2. Clone este repositório e aceda à pasta da API:

   ```bash
   git clone https://github.com/username/arquivo-censurado-api.git
   cd arquivo-censurado-api/api
   ```
3. Crie um ficheiro `.env` com base em `.env.example` e preencha as chaves:

   ```ini
   GOOGLE_API_KEY=
   DEEPSEEK_API_KEY=
   ```
4. Construa e execute a imagem Docker:

   ```bash
   docker build -t arquivo-censurado-api .
   docker run -d -p 8000:8000 --env-file .env arquivo-censurado-api
   ```
5. Aceda à documentação interativa em [http://localhost:8000/docs](http://localhost:8000/docs).

---

## Citação

Se utilizar este projeto em publicações científicas, agradecemos que faça referência à seguinte citação (exemplo):

> Brevemente

---

## Licença

Este software está licenciado sob a **GPL-3.0**, permitindo o uso e modificação para fins académicos e de investigação sem fins lucrativos. Consideramos a censura um tema de interesse público e, por isso, vedamos o uso comercial deste código.
