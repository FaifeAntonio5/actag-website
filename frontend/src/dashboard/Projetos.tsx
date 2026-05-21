import React, { useState, useEffect } from 'react';
import '../style/ProjetosDashboard.css';
import { projectosAPI } from '../lib/api';

// Interface ajustada para refletir o que o teu Backend devolve
interface Projecto {
  id: number;
  nome: string;
  descricao: string;
  categoria: string; 
  estado: 'Activo' | 'Pausado' | 'Concluído';
  progresso: number;
  meta: string;
  localizacao: string;
  orcamento?: number;
  dataInicio: string;
  dataFim?: string;
  // O backend devolve parceiros e financiadores como arrays de objetos conforme o teu criar()
  parceiros?: { id: number; nomeEntidade: string; tipoParticipacao: string }[];
  financiadores?: { id: number; nomeEntidade: string; montante?: number }[];
}

export default function Projetos() {
  // 1. INTEGRAÇÃO API: O estado começa vazio porque os dados vêm do banco
  const [projetos, setProjetos] = useState<Projecto[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Estados de controlo da Interface
  const [pesquisa, setPesquisa] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [modalAberto, setModalAberto] = useState(false);

  // Estado do Formulário para Novo Projeto
  const [novoProjeto, setNovoProjeto] = useState({
    nome: '',
    descricao: '',
    categoria: 'Mangais',
    meta: '',
    localizacao: '',
    orcamento: '',
    dataInicio: new Date().toISOString().split('T')[0],
    dataFim: '',
    parceiros: '',      // String temporária do input
    financiadores: ''   // String temporária do input
  });

  // 2. INTEGRAÇÃO API: Função para procurar os dados do banco usando os filtros nativos da tua API
  const carregarProjetos = async () => {
    setCarregando(true);
    try {
      const filtrosApi = {
        estado: filtroEstado !== 'Todos' ? filtroEstado : undefined,
        pesquisa: pesquisa || undefined
      };
      
      const dados = await projectosAPI.listar(filtrosApi);
      setProjetos(dados);
    } catch (erro) {
      console.error("Erro ao carregar projetos do banco:", erro);
    } finally {
      setCarregando(false);
    }
  };

  // Disparar a busca sempre que o filtro de estado ou a pesquisa mudarem
  useEffect(() => {
    carregarProjetos();
  }, [filtroEstado, pesquisa]);

  // 3. INTEGRAÇÃO API: Alterar Estado via PUT
  const alterarEstado = async (id: number, novoEstado: 'Activo' | 'Pausado' | 'Concluído') => {
    try {
      const dadosAtualizar = {
        estado: novoEstado,
        ...(novoEstado === 'Concluído' ? { progresso: 100 } : {})
      };
      
      await projectosAPI.actualizar(id, dadosAtualizar);
      // Recarrega do banco para garantir sincronia completa
      carregarProjetos(); 
    } catch (erro) {
      alert('Erro ao atualizar o estado no servidor.');
    }
  };

  // 4. INTEGRAÇÃO API: Alterar Progresso via PUT
  const alterarProgresso = async (id: number, novoProgresso: number) => {
    const valorValidado = Math.max(0, Math.min(100, novoProgresso));
    try {
      await projectosAPI.actualizar(id, { 
        progresso: valorValidado,
        ...(valorValidado === 100 ? { estado: 'Concluído' } : {})
      });
      carregarProjetos();
    } catch (erro) {
      alert('Erro ao atualizar o progresso no servidor.');
    }
  };

  // 5. INTEGRAÇÃO API: Eliminar via DELETE
  const eliminarProjeto = async (id: number) => {
    if (window.confirm('Desejas mesmo eliminar este projeto do banco de dados?')) {
      try {
        await projectosAPI.eliminar(id);
        setProjetos(prev => prev.filter(proj => proj.id !== id));
      } catch (erro) {
        alert('Erro ao eliminar o projeto do banco.');
      }
    }
  };

  // 6. INTEGRAÇÃO API: Submeter novo projeto via POST mapeando as strings para a estrutura correta
  const lidarComSubmissao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoProjeto.nome || !novoProjeto.descricao || !novoProjeto.meta || !novoProjeto.localizacao) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      // Mapeia os inputs simples de string para o formato de array de objetos que a tua API pede
      const dadosParaEnviar = {
        nome: novoProjeto.nome,
        descricao: novoProjeto.descricao,
        categoria: novoProjeto.categoria,
        meta: novoProjeto.meta,
        localizacao: novoProjeto.localizacao,
        orcamento: novoProjeto.orcamento ? parseFloat(novoProjeto.orcamento) : undefined,
        dataInicio: novoProjeto.dataInicio,
        dataFim: novoProjeto.dataFim || undefined,
        // Transforma o texto livre em objeto aceito pela API se houver dados
        parceiros: novoProjeto.parceiros 
          ? [{ nomeEntidade: novoProjeto.parceiros, tipoParticipacao: 'Geral' }] 
          : [],
        financiadores: novoProjeto.financiadores 
          ? [{ nomeEntidade: novoProjeto.financiadores, tipoApoio: 'Financeiro' }] 
          : []
      };

      await projectosAPI.criar(dadosParaEnviar);
      
      // Limpar formulário e atualizar lista
      setNovoProjeto({
        nome: '',
        descricao: '',
        categoria: 'Mangais',
        meta: '',
        localizacao: '',
        orcamento: '',
        dataInicio: new Date().toISOString().split('T')[0],
        dataFim: '',
        parceiros: '',
        financiadores: ''
      });
      setModalAberto(false);
      carregarProjetos();
    } catch (erro) {
      alert('Erro ao guardar o projeto no banco de dados.');
    }
  };

  return (
    <div className="editor-pagina">

      {/* Cabeçalho */}
      <div className="editor-cabecalho">
        <div>
          <h2 className="editor-titulo">Gestão de Projetos</h2>
          <p className="editor-subtitulo">Acompanhe os dados estruturais e o andamento real dos projetos</p>
        </div>
        <button className="editor-btn-novo" onClick={() => setModalAberto(true)}>
           Novo Projeto
        </button>
      </div>

      {/* Filtros */}
      <div className="barra-filtros">
        <input
          type="text"
          placeholder="Pesquisar por nome ou localização..."
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
        />
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="Todos">Todos os Estados</option>
          <option value="Activo">Activos</option>
          <option value="Pausado">Pausados</option>
          <option value="Concluído">Concluídos</option>
        </select>
      </div>

      {/* Estado de Carregamento da API */}
      {carregando ? (
        <div className="editor-placeholder-texto">A ligar ao banco de dados...</div>
      ) : projetos.length === 0 ? (
        <div className="editor-placeholder-texto">Nenhum projeto registado no banco.</div>
      ) : (
        <div className="projetos-grid">
          {projetos.map((projeto) => (
            <div className="cartao-projeto" key={projeto.id}>

              <div className="projeto-topo">
                <span className="projeto-categoria">{projeto.categoria}</span>
                <span className={`badge-estado ${projeto.estado.toLowerCase()}`}>
                  {projeto.estado}
                </span>
              </div>

              <div>
                <h3 className="projeto-nome">{projeto.nome}</h3>
                <p className="projeto-descricao">{projeto.descricao}</p>
              </div>

              {/* Barra de Progresso */}
              <div className="projeto-progresso-bloco">
                <div className="progresso-texto">
                  <span>Progresso do Projeto</span>
                  <span>{projeto.progresso}%</span>
                </div>
                <div className="progresso-barra-fundo">
                  <div
                    className="progresso-barra-preenchida"
                    style={{ width: `${projeto.progresso}%` }}
                  ></div>
                </div>
              </div>

              <div className="projeto-meta-dados">
                <div className="meta-dado-item">
                  <strong>Localização:</strong> <span>{projeto.localizacao}</span>
                </div>
                <div className="meta-dado-item">
                  <strong>Meta / Objeto:</strong> <span>{projeto.meta}</span>
                </div>
                <div className="meta-dado-item">
                  <strong>Orçamento:</strong>
                  <span>{projeto.orcamento ? `${projeto.orcamento.toLocaleString()} MT` : 'Não definido'}</span>
                </div>
                <div className="meta-dado-item">
                  {/* Como a API envia um array, fazemos um map simples para listar as entidades separadas por vírgula */}
                  <strong>Parceiros:</strong> 
                  <span>
                    {projeto.parceiros && projeto.parceiros.length > 0 
                      ? projeto.parceiros.map(p => p.nomeEntidade).join(', ') 
                      : 'Não definido'}
                  </span>
                </div>
                <div className="meta-dado-item">
                  <strong>Financiadores:</strong> 
                  <span>
                    {projeto.financiadores && projeto.financiadores.length > 0 
                      ? projeto.financiadores.map(f => f.nomeEntidade).join(', ') 
                      : 'Não definido'}
                  </span>
                </div>
              </div>

              {/* Área de Controlos Rápidos */}
              <div className="projeto-acoes">
                <select
                  value={projeto.estado}
                  className={`select-estado-rapido estado-${projeto.estado.toLowerCase()}`}
                  onChange={(e) => alterarEstado(projeto.id, e.target.value as any)}
                >
                  <option value="Activo">Activo</option>
                  <option value="Pausado">Pausado</option>
                  <option value="Concluído">Concluído</option>
                </select>

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={projeto.progresso}
                  className="input-progresso-rapido"
                  onChange={(e) => alterarProgresso(projeto.id, Number(e.target.value))}
                />

                <button className="btn-icon-eliminar" onClick={() => eliminarProjeto(projeto.id)}>
                  🗑️
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ── MODAL DE CADASTRO ── */}
      {modalAberto && (
        <div className="modal-fundo">
          <div className="modal-content">
            <div className="modal-cabecalho">
              <h3>Registar Novo Projeto</h3>
              <button className="modal-fechar" onClick={() => setModalAberto(false)}>×</button>
            </div>

            <form onSubmit={lidarComSubmissao}>
              <div className="modal-corpo">

                <div>
                  <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px', display: 'block' }}>Nome do Projeto </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Reflorestamento da Costa"
                    value={novoProjeto.nome}
                    onChange={(e) => setNovoProjeto({ ...novoProjeto, nome: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px', display: 'block' }}>Categoria</label>
                    <select
                      value={novoProjeto.categoria}
                      onChange={(e) => setNovoProjeto({ ...novoProjeto, categoria: e.target.value })}
                    >
                      <option value="Mangais">Mangais</option>
                      <option value="Limpeza">Limpeza</option>
                      <option value="Capacitação">Capacitação</option>
                      <option value="Acácias">Acácias</option>
                      <option value="Parceria">Parceria</option>
                    </select>
                  </div>

                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px', display: 'block' }}>Orçamento (MT)</label>
                    <input
                      type="number"
                      placeholder="Opcional"
                      value={novoProjeto.orcamento}
                      onChange={(e) => setNovoProjeto({ ...novoProjeto, orcamento: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px', display: 'block' }}>Localização Completa </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Sofala, Beira, Bairro Central"
                    value={novoProjeto.localizacao}
                    onChange={(e) => setNovoProjeto({ ...novoProjeto, localizacao: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px', display: 'block' }}>Meta / Objeto do Projeto </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Alcançar 100 famílias"
                    value={novoProjeto.meta}
                    onChange={(e) => setNovoProjeto({ ...novoProjeto, meta: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px', display: 'block' }}>Descrição Detalhada </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Escreva sobre o escopo do projeto..."
                    value={novoProjeto.descricao}
                    onChange={(e) => setNovoProjeto({ ...novoProjeto, descricao: e.target.value })}
                    style={{ width: '100%', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '11px 14px', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px', display: 'block' }}>Parceiros</label>
                    <input
                      type="text"
                      placeholder="Opcional (Ex: EcoServiços)"
                      value={novoProjeto.parceiros}
                      onChange={(e) => setNovoProjeto({ ...novoProjeto, parceiros: e.target.value })}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px', display: 'block' }}>Financiadores</label>
                    <input
                      type="text"
                      placeholder="Opcional (Ex: ACTAG)"
                      value={novoProjeto.financiadores}
                      onChange={(e) => setNovoProjeto({ ...novoProjeto, financiadores: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px', display: 'block' }}>Data de Início</label>
                    <input
                      type="date"
                      value={novoProjeto.dataInicio}
                      onChange={(e) => setNovoProjeto({ ...novoProjeto, dataInicio: e.target.value })}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px', display: 'block' }}>Data de Término</label>
                    <input
                      type="date"
                      value={novoProjeto.dataFim}
                      onChange={(e) => setNovoProjeto({ ...novoProjeto, dataFim: e.target.value })}
                    />
                  </div>
                </div>

                <div className="modal-acoes-rodape">
                  <button type="button" className="btn-secundario" onClick={() => setModalAberto(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-sucesso">
                    Gravar no Banco
                  </button>
                </div>

              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}