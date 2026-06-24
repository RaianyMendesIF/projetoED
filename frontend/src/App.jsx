import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [fila, setFila] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [nome, setNome] = useState('');
  const [prioridade, setprioridade] = useState('Normal');
  const [proximaSenha, setProximaSenha] = useState(1);
  
  const [buscaNomeUnico, setBuscaNomeUnico] = useState('');
  const [resultadoNome, setResultadoNome] = useState(null);
  const [buscaNome, setBuscaNome] = useState('');
  const [buscaSenha, setBuscaSenha] = useState('');
  const [resultadoSenha, setResultadoSenha] = useState(null);
  const [ordemHistorico, setOrdemHistorico] = useState('recente');

  const formatarDataHora = (valor) => {
    if (!valor) return '';

    if (typeof valor === 'string' && valor.includes(' ')) {
      const [data, hora] = valor.split(' ');
      if (/^\d{4}-\d{2}-\d{2}$/.test(data) && /^\d{2}:\d{2}(:\d{2})?$/.test(hora)) {
        const [ano, mes, dia] = data.split('-');
        return `${dia}/${mes}/${ano} ${hora}`;
      }
    }

    return valor;
  };

  // 🔄 BUSCA DADOS PASSANDO OS FILTROS DIRETO PARA O PYTHON
  const carregarDadosDoServidor = async () => {
    try {
      // Passa a busca por nome e a ordenação como parâmetros na URL (Query Params)
      const url = `http://localhost:5000/dados?busca=${encodeURIComponent(buscaNome)}&ordem=${ordemHistorico}`;
      const resposta = await fetch(url);
      if (!resposta.ok) throw new Error('Erro no servidor');
      const dados = await resposta.json();
      
      setFila(dados.fila || []);
      setHistorico(dados.historico || []);
      setProximaSenha(dados.proximaSenha || 1);
    } catch (erro) {
      console.error("Erro ao conectar com o Python:", erro);
    }
  };

  // 🧠 Sempre que 'buscaNome' ou 'ordemHistorico' mudarem, recarrega os dados filtrados direto do Python
  useEffect(() => {
    carregarDadosDoServidor();
  }, [buscaNome, ordemHistorico]);

  const adicionarCliente = async (e) => {
    e.preventDefault();
    if (!nome.trim()) return;

    try {
      await fetch('http://localhost:5000/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.trim(),
          tipo: prioridade,
          chegada: new Date().toLocaleTimeString()
        })
      });
      setNome('');
      await carregarDadosDoServidor(); 
    } catch (erro) {
      console.error("Erro ao cadastrar:", erro);
    }
  };

  const chamarProximo = async () => {
    try {
      await fetch('http://localhost:5000/chamar', { method: 'POST' });
      await carregarDadosDoServidor();
    } catch (erro) {
      console.error(erro);
    }
  };

  const cancelarAtendimento = async (id) => {
    try {
      await fetch(`http://localhost:5000/cancelar/${id}`, { method: 'POST' });
      await carregarDadosDoServidor();
    } catch (erro) {
      console.error(erro);
    }
  };

  const lidarBuscaSenha = async (e) => {
    e.preventDefault();
    if (!buscaSenha) return;
    try {
      const resposta = await fetch(`http://localhost:5000/buscar-senha/${buscaSenha}`);
      const dados = await resposta.json();
      setResultadoSenha(dados.encontrado ? dados.cliente : 'Não encontrado');
    } catch (erro) {
      setResultadoSenha('Erro na busca');
    }
  };

  const lidarBuscaNome = async (e) => {
  e.preventDefault();
  if (!buscaNomeUnico.trim()) return;
  try {
    const resposta = await fetch(`http://localhost:5000/buscar-nome?nome=${encodeURIComponent(buscaNomeUnico.trim())}`);
    const dados = await resposta.json();
    setResultadoNome(dados.encontrado ? dados.cliente : 'Nenhum cliente encontrado com este nome');
  } catch (erro) {
    setResultadoNome('Erro na busca por nome');
  }
};

  return (
    <div className="container-painel">
      <main className="grid-tres-colunas">
        
        {/* COLUNA 1: NOVO ATENDIMENTO E BUSCA HASH */}
        <div className="coluna-lateral">
          <section className="card">
            <h2 className="titulo-secao">👤 Novo Atendimento</h2>
            <form onSubmit={adicionarCliente} className="formulario">
              <div className="campo">
                <label className="label-campo">Nome do Cliente</label>
                <input 
                  type="text" 
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Maria Silva"
                  className="input-texto"
                />
              </div>
              <div className="campo">
                <label className="label-campo">Tipo de Prioridade</label>
                <div className="botoes-prioridade">
                  {['Normal', 'Preferencial'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setprioridade(t)}
                      className={`botao-opcao ${prioridade === t ? 'ativo' : ''}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="botao-submit">
                Gerar Senha #{proximaSenha}
              </button>
            </form>
          </section>

          <section className="card">
            <h2 className="titulo-secao">🔍 Localização Rápida</h2>
            <p className="subtexto">Busca instantânea O(1) via Tabela Hash.</p>
            <form onSubmit={lidarBuscaSenha} className="form-busca">
              <input 
                type="number" 
                placeholder="Nº da Senha" 
                value={buscaSenha}
                onChange={(e) => setBuscaSenha(e.target.value)}
                className="input-texto"
              />
              <button type="submit" className="botao-busca">Buscar</button>
            </form>

            {resultadoSenha && (
              <div className="resultado-hash">
                {typeof resultadoSenha === 'string' ? (
                  <p className="texto-erro">{resultadoSenha}</p>
                ) : (
                  <div>
                    <p className="resultado-nome">{resultadoSenha.nome}</p>
                    <p className="resultado-status">Status: <span>{resultadoSenha.status}</span></p>
                    <p className="resultado-prioridade">Prioridade: {resultadoSenha.prioridade || resultadoSenha.tipo}</p>
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="card card-busca-nome" style={{ marginTop: '20px' }}>
            <h2 className="titulo-secao">🔍 Localizar por Nome</h2>
            <p className="subtexto">Busca o status atual do cliente pelo nome completo.</p>
            <form onSubmit={lidarBuscaNome} className="form-busca">
              <input 
                type="text" 
                placeholder="Nome completo do cliente" 
                value={buscaNomeUnico}
                onChange={(e) => setBuscaNomeUnico(e.target.value)}
                className="input-texto"
              />
              <button type="submit" className="botao-busca">Buscar</button>
            </form>

            {resultadoNome && (
              <div className="resultado-hash">
                {typeof resultadoNome === 'string' ? (
                  <p className="texto-erro">{resultadoNome}</p>
                ) : (
                  <div>
                    <p className="resultado-nome">{resultadoNome.nome}</p>
                    <p className="resultado-status">
                      Status: <span className={`status-${resultadoNome.status.toLowerCase()}`}>{resultadoNome.status}</span>
                    </p>
                    <p className="resultado-prioridade">Senha: <strong>#{resultadoNome.senha}</strong></p>
                    <p className="resultado-prioridade">Prioridade: {resultadoNome.prioridade || resultadoNome.tipo}</p>
                    {resultadoNome.conclusao && <p className="resultado-prioridade">Horário: {resultadoNome.conclusao}</p>}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        {/* COLUNA 2: FILA DE ESPERA (Lógica no seu Queue TAD) */}
        <div className="coluna-central">
          <header className="card header-operacional">
            <div>
              <h1 className="logo-painel">AtendFácil</h1>
              <p className="subtexto">Painel de Gerenciamento de Filas</p>
            </div>
            <button onClick={chamarProximo} disabled={fila.length === 0} className="botao-chamar">
              ▶️ Chamar Próximo
            </button>
          </header>

          <section className="card card-fila-espera">
            <div className="topo-fila">
              <h2 className="titulo-secao">👥 Fila de Espera</h2>
              <span className="badge-contador">{fila.length} Pessoas</span>
            </div>

            <div className="lista-scroll scroll-fila">
              {fila.length === 0 ? (
                <p className="texto-vazio">Nenhum cliente na fila no momento.</p>
              ) : (
                fila.map((cliente, index) => (
                  <div key={cliente.id} className="item-lista item-fila">
                    <div className="item-info">
                      <div className="posicao-numero">{index + 1}º</div>
                      <div>
                        <h3 className="cliente-nome">{cliente.nome}</h3>
                        <div className="tags-container">
                          <span className="tag tag-senha">Senha {cliente.senha}</span>
                          <span className={`tag tag-prioridade ${(cliente.prioridade || 'Normal').toLowerCase()}`}>
                            {cliente.prioridade || 'Normal'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => cancelarAtendimento(cliente.id)} className="botao-cancelar">❌</button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* COLUNA 3: HISTÓRICO TRATADO PELO PYTHON */}
        <div className="coluna-lateral">
          <section className="card card-historico">
            <div className="topo-historico">
              <h2 className="titulo-secao">🕒 Histórico</h2>
              <select value={ordemHistorico} onChange={(e) => setOrdemHistorico(e.target.value)} className="select-filtro">
                <option value="recente">Mais Recentes</option>
                <option value="antigo">Mais Antigos</option>
              </select>
            </div>
            
            <div className="busca-historico">
              <input 
                type="text" 
                placeholder="Filtrar por nome..." 
                value={buscaNome}
                onChange={(e) => setBuscaNome(e.target.value)}
                className="input-texto input-historico"
              />
            </div>

            <div className="lista-scroll scroll-historico">
              {historico.length === 0 ? (
                <p className="texto-vazio">Nenhum registro encontrado.</p>
              ) : (
                historico.map((h) => (
                  <div key={h.id} className="item-lista item-historico">
                    <div>
                      <h4 className="historico-nome">{h.nome}</h4>
                      <p className="historico-detalhes">Senha {h.senha} • {formatarDataHora(h.data_hora || h.conclusao)}</p>
                    </div>
                    <span className={`badge-status status-${(h.status || 'concluido').toLowerCase()}`}>
                      {h.status === 'Concluído' ? '✅' : '❌'} {h.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

      </main>
    </div>
  );
}