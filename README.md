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
├── backend/                  # BACK-END: Python
│   ├── app/
│   │   ├── main.py           # Inicialização da API e definição das Rotas
│   │   │
│   │   └── classes.py        # Classes de Fila criadas
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
│   │   └── App.cs            # Estilos da página principal
│   │
│   ├── package.json          # Dependências e scripts do React
│   └── README.md             # Como rodar o front-end
│
└── README.md                 # Guia Geral explicando o projeto e como rodar ambos
```

## Executar o sistema

### Back-End
``` cd backend ``` <br>
``` pip install -r requirements.txt``` <br>
``` python main.py ``` <br>

### Front-End
``` cd frontend ``` <br>
``` pip install -r requirements.txt``` <br>
``` nmp run dev ``` <br>

### Atualizar o arquivo de requerimentos
``` pip freeze > requirements.txt``` <br>


## ETAPA 1
Simulação de um sistema de atendimento com fila de espera, como em uma clínica ou banco. O backend deve ser inteiramente em Python.

Requisitos funcionais — anunciados agora:

- Cadastrar cliente com nome e tipo de atendimento (normal ou preferencial)
- Adicionar cliente à fila de espera
- Chamar próximo cliente respeitando a prioridade (preferencial à frente)
- Exibir status atual da fila (posição de cada cliente)
- Registrar atendimentos concluídos em uma lista de histórico
- Cancelar atendimento e remover cliente da fila

A definir em aula:

- Ordenar histórico de atendimentos por data e hora
- Buscar cliente no histórico por nome
- Localização rápida de cliente por número de senha (tabela hash)

## ETAPA 1
Cadastrar um cliente e exibi-lo na fila de espera da interface utilizando a estrutura de fila implementada no backend.

## ETAPA 3
- Chamar próximo cliente respeitando a prioridade (preferencial à frente)
- Exibir status da fila com a posição de cada cliente
- Registrar atendimento concluído no histórico
- Cancelar atendimento e remover cliente da fila

## ETAPA 4
- Ordenar o histórico de atendimentos por data e hora
- Buscar cliente no histórico por nome