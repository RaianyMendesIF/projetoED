# Projeto de Estrutura de Dados

## Integrantes:
Raiany Vitoria Prado Mendes
Sara Oliveira Mendes
Yasmin Hester Pereira da Silva

## Projeto 02 — Carrinho de compras
Sistema que simula um carrinho de compras de uma loja virtual. O backend deve ser inteiramente em Python.

_Requisitos funcionais:_
- Cadastrar produto com nome, preço e quantidade em estoque
- Adicionar produto ao carrinho com quantidade desejada
- Remover produto do carrinho
- Desfazer a última ação no carrinho (usando pilha)
- Exibir resumo do carrinho com total atualizado
- Finalizar compra e atualizar estoque
- Exibir histórico de compras realizadas (usando lista encadeada)

_A definir em aula:_
- Ordenar produtos por nome ou preço
- Buscar produto por nome ou categoria
- Localização rápida de produto por código (tabela hash)

## Tecnologia
Front-End: **React**
Back-End: **Python 3**
Tecnologia de front-end que o grupo pretende utilizar

## Estrutura do Projeto
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
