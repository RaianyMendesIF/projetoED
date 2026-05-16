# Projeto de Estrutura de Dados

## Integrantes:
Raiany Vitoria Prado Mendes <br>
Sara Oliveira Mendes <br>
Yasmin Hester Pereira da Silva <br>

## Projeto 03 — Sistema de atendimento (fila de espera)
Simulação de um sistema de atendimento com fila de espera, como em uma clínica ou banco.

_Requisitos funcionais:_
- Cadastrar cliente com nome e tipo de atendimento (normal ou preferencial)
- Adicionar cliente à fila de espera
- Chamar próximo cliente respeitando a prioridade (preferencial à frente)
- Exibir status atual da fila (posição de cada cliente)
- Registrar atendimentos concluídos em uma lista de histórico
- Cancelar atendimento e remover cliente da fila
  
_A definir em aula:_
- Ordenar histórico de atendimentos por data e hora
- Buscar cliente no histórico por nome
- Localização rápida de cliente por número de senha (tabela hash)

## Tecnologia
- Front-End: **React**
- Back-End: **Python 3**

## Estrutura do Projeto
```
meu-projeto-carrinho/
│
├── backend/                  # BACK-END: Python + API FastAPI
│   ├── app/
│   │   ├── main.py           # Inicialização da API e definição das Rotas
│   │   │
│   │   ├── tads/             
│   │   │   └── carrinho.py   # Lógica do carrinho usando o seu TAD
│   │   │
│   │   └── schemas.py        # Validação de dados (Pydantic) para as rotas
│   │
│   ├── venv/                 # Ambiente virtual do Python
│   ├── requirements.txt      # Arquivo com as dependências (fastapi, uvicorn)
│   └── README.md             # Como rodar o back-end
│
├── frontend/                 
│   ├── node_modules/         # Dependências do Node (NÃO enviar para o Git)
│   ├── public/               # Arquivos públicos (favicons, imagens estáticas)
│   ├── src/
│   │   ├── assets/           # Imagens dos produtos, estilos globais, etc.
│   │   ├── components/       # Componentes React visuais (Vitrine, Card, Botões)
│   │   ├── services/         # Funções que chamam a API do Python (fetch/axios)
│   │   │   └── api.js
│   │   ├── App.jsx           # Componente principal que gerencia o estado da tela
│   │   └── main.jsx          # Ponto de entrada do React
│   │
│   ├── package.json          # Dependências e scripts do React
│   └── README.md             # Como rodar o front-end
│
├── .gitignore                # Configurado para ignorar venv/ e node_modules/
└── README.md                 # Guia Geral explicando o projeto e como rodar ambos
```
