import React, { useState, useMemo } from 'react';
import './App.css';

export default function App() {
  // Estados principais
  const [fila, setFila] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('Normal');
  const [proximaSenha, setProximaSenha] = useState(1);
  
  // Estados de busca e filtro
  const [buscaNome, setBuscaNome] = useState('');
  const [buscaSenha, setBuscaSenha] = useState('');
  const [resultadoSenha, setResultadoSenha] = useState(null);
  const [ordemHistorico, setOrdemHistorico] = useState('recente');

  // --- TABELA HASH (O(1)) ---
  const tabelaHashSenhas = useMemo(() => {
    const hash = {};
    [...fila, ...historico].forEach(cliente => {
      hash[cliente.senha] = cliente;
    });
    return hash;
  }, [fila, historico]);

  const lidarBuscaSenha = (e) => {
    e.preventDefault();
    const senhaNum = parseInt(buscaSenha);
    if (tabelaHashSenhas[senhaNum]) {
      setResultadoSenha(tabelaHashSenhas[senhaNum]);
    } else {
      setResultadoSenha('Não encontrado');
    }
  };

  // --- REQUISITOS FUNCIONAIS ---
  const adicionarCliente = (e) => {
    e.preventDefault();
    if (!nome.trim()) return;

    const novoCliente = {
      id: Math.random().toString(36).substr(2, 9),
      nome: nome.trim(),
      tipo,
      senha: proximaSenha,
      status: 'Aguardando',
      chegada: new Date().toLocaleTimeString()
    };

    setFila(filaAtual => {
      if (tipo === 'Preferencial') {
        const indexUltimoPref = filaAtual.findLastIndex(c => c.tipo === 'Preferencial');
        const novaFila = [...filaAtual];
        novaFila.splice(indexUltimoPref + 1, 0, novoCliente);
        return novaFila;
      }
      return [...filaAtual, novoCliente];
    });

    setProximaSenha(prev => prev + 1);
    setNome('');
  };

  const chamarProximo = () => {
    if (fila.length === 0) return;

    const [proximo, ...restanteFila] = fila;
    
    const clienteAtendido = {
      ...proximo,
      status: 'Concluído',
      conclusao: new Date().toLocaleTimeString()
    };

    setFila(restanteFila);
    setHistorico(prev => [clienteAtendido, ...prev]);
  };

  const cancelarAtendimento = (id) => {
    const clienteCancelado = fila.find(c => c.id === id);
    if (!clienteCancelado) return;

    setFila(prev => prev.filter(c => c.id !== id));
    setHistorico(prev => [
      { ...clienteCancelado, status: 'Cancelado', conclusao: new Date().toLocaleTimeString() },
      ...prev
    ]);
  };

  const historicoFiltradoEOrdenado = useMemo(() => {
    let resultado = historico.filter(c => 
      c.nome.toLowerCase().includes(buscaNome.toLowerCase())
    );
    return resultado.sort((a, b) => {
      return ordemHistorico === 'recente' ? 1 : -1;
    });
  }, [historico, buscaNome, ordemHistorico]);

  return (
    <div className="container-painel">
      <main className="grid-tres-colunas">
        
        {/* COLUNA 1 (ESQUERDA - MAIS ESTREITA) */}
        <div className="coluna-lateral">
          {/* Cadastro */}
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
                <div className="botoes-tipo">
                  {['Normal', 'Preferencial'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTipo(t)}
                      className={`botao-opcao ${tipo === t ? 'ativo' : ''}`}
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

          {/* Localização Rápida */}
          <section className="card">
            <h2 className="titulo-secao">🔍 Localização Rápida</h2>
            <p className="subtexto">Busca instantânea $O(1)$ via Tabela Hash.</p>
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
                    <p className="resultado-status">Status: <span className={`status-${resultadoSenha.status.toLowerCase()}`}>{resultadoSenha.status}</span></p>
                    <p className="resultado-tipo">Tipo: {resultadoSenha.tipo}</p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        {/* COLUNA 2 (CENTRO - MAIS COMPRIDA) */}
        <div className="coluna-central">
          {/* Topo Central: AtendFácil + Chamar Próximo */}
          <header className="card header-operacional">
            <div>
              <h1 className="logo-painel">AtendFácil</h1>
              <p className="subtexto">Painel de Gerenciamento de Filas</p>
            </div>
            <button 
              onClick={chamarProximo}
              disabled={fila.length === 0}
              className="botao-chamar"
            >
              ▶️ Chamar Próximo
            </button>
          </header>

          {/* Lista de Espera */}
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
                          <span className={`tag tag-prioridade ${cliente.tipo.toLowerCase()}`}>
                            {cliente.tipo}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => cancelarAtendimento(cliente.id)}
                      className="botao-cancelar"
                      title="Cancelar Atendimento"
                    >
                      ❌
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* COLUNA 3 (DIREITA - MESMA LARGURA DA PRIMEIRA) */}
        <div className="coluna-lateral">
          <section className="card card-historico">
            <div className="topo-historico">
              <h2 className="titulo-secao">🕒 Histórico</h2>
              <select 
                value={ordemHistorico} 
                onChange={(e) => setOrdemHistorico(e.target.value)}
                className="select-filtro"
              >
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
              {historicoFiltradoEOrdenado.length === 0 ? (
                <p className="texto-vazio">Nenhum registro encontrado.</p>
              ) : (
                historicoFiltradoEOrdenado.map((h) => (
                  <div key={h.id} className="item-lista item-historico">
                    <div>
                      <h4 className="historico-nome">{h.nome}</h4>
                      <p className="historico-detalhes">
                        Senha {h.senha} • {h.conclusao}
                      </p>
                    </div>
                    <span className={`badge-status status-${h.status.toLowerCase()}`}>
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