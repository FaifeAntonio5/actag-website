import { useState, useEffect } from "react";
import { 
  Users, Plus, Search, Loader2, Mail, 
  Briefcase, ShieldAlert, Trash2, ToggleLeft, ToggleRight 
} from "lucide-react";
import { membrosAPI } from "../lib/api";
import "../style/MembrosDashboard.css";

type Membro = {
  id: number;
  nome: string;
  email: string;
  cargo: string;
  status: string;
  criadoEm: string;
};

const PainelMembros = () => {
  const [membros, setMembros] = useState<Membro[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [pesquisa, setPesquisa] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [processandoId, setProcessandoId] = useState<number | null>(null);

  // Estados do Formulário de Novo Membro
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState("");

  const carregarMembros = async () => {
    setCarregando(true);
    try {
      const dados = await membrosAPI.listar();
      setMembros(dados);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarMembros();
  }, []);

  // Handler para criar membro (POST)
  const handleSubmeterForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setErroForm("");

    try {
      const novoMembro = await membrosAPI.criar({ nome, email, cargo });
      setMembros((prev) => [novoMembro, ...prev]);
      
      setNome("");
      setEmail("");
      setCargo("");
      setModalAberto(false);
    } catch (err: any) {
      setErroForm(err.message);
    } finally {
      setSalvando(false);
    }
  };

  // Handler para alternar Status (PUT)
  const handleAlternarStatus = async (membro: Membro) => {
    setProcessandoId(membro.id);
    const novoStatus = membro.status === "Ativo" ? "Pendente" : "Ativo";
    
    try {
      const membroAtualizado = await membrosAPI.atualizar(membro.id, {
        nome: membro.nome,
        email: membro.email,
        cargo: membro.cargo,
        status: novoStatus
      });
      
      setMembros(prev => prev.map(m => m.id === membro.id ? membroAtualizado : m));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessandoId(null);
    }
  };

  // Handler para eliminar membro (DELETE)
  const handleEliminarMembro = async (id: number, nomeMembro: string) => {
    if (!confirm(`Tens a certeza que desejas remover ${nomeMembro} da ACTAG?`)) return;
    setProcessandoId(id);

    try {
      await membrosAPI.eliminar(id);
      setMembros(prev => prev.filter(m => m.id !== id));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessandoId(null);
    }
  };

  const filtrados = membros.filter(m =>
    m.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
    m.cargo.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    <div className="mensagens-pagina">
      {/* Cabeçalho do Painel */}
      <header className="mensagens-cabecalho">
        <div className="mensagens-cabecalho-esquerda">
          <div className="mensagens-cabecalho-icone" style={{ backgroundColor: '#10b981' }}>
            <Users size={22} color="#fff" />
          </div>
          <div>
            <h1 className="mensagens-titulo">Gestão de Membros</h1>
            <p className="mensagens-subtitulo">{membros.length} membros integrados na ACTAG</p>
          </div>
        </div>

        <button className="btn-sucesso" style={{ borderRadius: '8px' }} onClick={() => setModalAberto(true)}>
          <Plus size={18} /> Adicionar Membro
        </button>
      </header>

      {/* Filtro e Pesquisa */}
      <div className="mensagens-pesquisa-area">
        <div className="mensagens-campo-pesquisa">
          <Search size={16} className="mensagens-icone-pesquisa" />
          <input
            type="text"
            placeholder="Pesquisar por nome ou área de atuação (cargo)..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            className="mensagens-input-pesquisa"
          />
        </div>
      </div>

      {/* Quadro de listagem */}
      {carregando ? (
        <div className="mensagens-carregando">
          <Loader2 size={28} className="girando" />
          <span>A carregar quadro de membros...</span>
        </div>
      ) : (
        <div className="membros-grid-container">
          {filtrados.length === 0 ? (
            <p className="mensagens-vazio">Nenhum membro encontrado com estes critérios.</p>
          ) : (
            filtrados.map((membro) => (
              <div key={membro.id} className="cartao-membro">
                <div className="membro-perfil-bloco">
                  <div className="membro-avatar-generico">{membro.nome.charAt(0).toUpperCase()}</div>
                  <div className="membro-dados-principais">
                    <h3>{membro.nome}</h3>
                    <span className="membro-identificador">ID: #{membro.id}</span>
                  </div>
                </div>

                <hr className="membro-divisor" />

                <div className="membro-info-detalhes">
                  <span className="membro-linha-info">
                    <Briefcase size={14} color="#64748b" /> <strong>Área:</strong> {membro.cargo}
                  </span>
                  <span className="membro-linha-info">
                    <Mail size={14} color="#64748b" /> <strong>E-mail:</strong> {membro.email}
                  </span>
                </div>

                <div className="membro-rodape-status">
                  <span className={`status-badge ${membro.status.toLowerCase() === 'ativo' ? 'activo' : 'pendente'}`}>
                    {membro.status}
                  </span>
                  <span className="membro-data-registo">
                    {new Date(membro.criadoEm).toLocaleDateString('pt-MZ')}
                  </span>
                </div>

                {/* Painel de ações do cartão */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '10px', marginTop: '4px' }}>
                  <button 
                    onClick={() => handleAlternarStatus(membro)}
                    disabled={processandoId === membro.id}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#475569' }}
                    title="Alternar estado de atividade"
                  >
                    {membro.status === "Ativo" ? <ToggleRight size={20} color="#10b981" /> : <ToggleLeft size={20} color="#94a3b8" />}
                    Status
                  </button>
                  <button 
                    onClick={() => handleEliminarMembro(membro.id, membro.nome)}
                    disabled={processandoId === membro.id}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#ef4444' }}
                  >
                    <Trash2 size={15} /> Remover
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── TELA MODAL DE CADASTRO ── */}
      {modalAberto && (
        <div className="modal-sobreposicao">
          <div className="modal-conteudo-caixa">
            
            <div className="modal-cabecalho-topo">
              <h2>Registar Novo Membro</h2>
              <button className="modal-botao-fechar" onClick={() => setModalAberto(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmeterForm} className="modal-formulario-corpo">
              {erroForm && (
                <div className="modal-alerta-erro">
                  <ShieldAlert size={16} /> {erroForm}
                </div>
              )}

              <div className="form-grupo-campo">
                <label>Nome Completo</label>
                <input type="text" required value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Mateus Cambe" />
              </div>

              <div className="form-grupo-campo">
                <label>Endereço de E-mail</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Ex: mateus@actag.org" />
              </div>

              <div className="form-grupo-campo">
                <label>Área de Atuação / Cargo</label>
                <input type="text" required value={cargo} onChange={e => setCargo(e.target.value)} placeholder="Ex: Proteção de Mangais, Comunicação" />
              </div>

              <div className="modal-acoes-rodape">
                <button type="button" onClick={() => setModalAberto(false)} className="btn-secundario">
                  Cancelar
                </button>
                <button type="submit" disabled={salvando} className="btn-sucesso">
                  {salvando ? <Loader2 size={16} className="girando" /> : 'Salvar Membro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PainelMembros;