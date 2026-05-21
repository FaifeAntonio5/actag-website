import { useState, useEffect } from "react";
import {
  Mail, Search, RefreshCw,
  Loader2, Users, Calendar, UserCheck, UserX
} from "lucide-react";
import "../style/Mensagens.css"; // Reutilizando o seu CSS para manter as cores
import { informativoAPI } from "../lib/api";

// ── Tipo ─────────────────────────────────────────────────────
type Subscritor = {
  id: number;
  nome: string;
  email: string;
  activo: boolean;
  criadoEm: string;
};

// ── Componente ───────────────────────────────────────────────
const ListaInformativo = () => {
  const [subscritores,    setSubscritores]    = useState<Subscritor[]>([]);
  const [carregando,      setCarregando]      = useState(true);
  const [erro,            setErro]            = useState('');
  const [pesquisa,        setPesquisa]        = useState('');
  const [itemAberta,      setItemAberta]      = useState<Subscritor | null>(null);
  const [processando,     setProcessando]     = useState<string | null>(null); // Armazena o email em processamento

  // ── Buscar dados do backend ──
  const carregarDados = async () => {
    setCarregando(true);
    setErro('');
    try {
      const dados = await informativoAPI.listar();
      setSubscritores(dados);
    } catch (err: any) {
      setErro(err.message || 'Erro ao carregar lista de subscritores.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // ── Cancelar Subscrição (Desativar) ──
  const handleCancelar = async (email: string) => {
    if (!confirm(`Deseja realmente cancelar a subscrição de ${email}?`)) return;
    setProcessando(email);
    try {
      await informativoAPI.cancelarSubscricao(email);
      // Remove da lista visualmente (ou marca como inativo se preferir)
      setSubscritores(prev => prev.filter(s => s.email !== email));
      if (itemAberta?.email === email) setItemAberta(null);
    } catch (err: any) {
      alert(err.message || 'Erro ao cancelar subscrição.');
    } finally {
      setProcessando(null);
    }
  };

  // ── Filtrar por pesquisa ──
  const filtrados = subscritores.filter(s =>
    s.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
    s.email.toLowerCase().includes(pesquisa.toLowerCase())
  );

  // ── Formatar data ──
  const formatarData = (data: string) =>
    new Date(data).toLocaleDateString('pt-MZ', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  return (
    <div className="mensagens-pagina">

      {/* ── Cabeçalho ── */}
      <header className="mensagens-cabecalho">
        <div className="mensagens-cabecalho-esquerda">
          <div className="mensagens-cabecalho-icone">
            <Users size={22} />
          </div>
          <div>
            <h1 className="mensagens-titulo">Boletim Informativo</h1>
            <p className="mensagens-subtitulo">
              {carregando ? 'A carregar...' : `${subscritores.length} subscritor${subscritores.length !== 1 ? 'es' : ''} activo${subscritores.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        <button className="mensagens-botao-actualizar" onClick={carregarDados} disabled={carregando}>
          <RefreshCw size={16} className={carregando ? 'girando' : ''} />
          Actualizar
        </button>
      </header>

      {/* ── Barra de pesquisa ── */}
      <div className="mensagens-pesquisa-area">
        <div className="mensagens-campo-pesquisa">
          <Search size={16} className="mensagens-icone-pesquisa" />
          <input
            type="text"
            placeholder="Pesquisar por nome ou email..."
            value={pesquisa}
            onChange={e => setPesquisa(e.target.value)}
            className="mensagens-input-pesquisa"
          />
        </div>
      </div>

      {/* ── Carregamento e Erro ── */}
      {carregando && (
        <div className="mensagens-carregando">
          <Loader2 size={28} className="girando" />
          <span>A carregar subscritores...</span>
        </div>
      )}

      {erro && !carregando && (
        <div className="mensagens-erro">
          <p>{erro}</p>
          <button onClick={carregarDados} className="mensagens-botao-tentar">Tentar novamente</button>
        </div>
      )}

      {/* ── Conteúdo ── */}
      {!carregando && !erro && (
        <div className="mensagens-corpo">

          <div className={`mensagens-lista ${itemAberta ? 'com-detalhe' : ''}`}>
            {filtrados.length === 0 ? (
              <div className="mensagens-vazio">
                <UserX size={40} />
                <p>{pesquisa ? 'Nenhum subscritor encontrado.' : 'Ainda não há inscritos.'}</p>
              </div>
            ) : (
              filtrados.map(s => (
                <div
                  key={s.id}
                  className={`mensagens-item ${itemAberta?.id === s.id ? 'activa' : ''}`}
                  onClick={() => setItemAberta(itemAberta?.id === s.id ? null : s)}
                >
                  <div className="mensagens-item-avatar">
                    {s.nome.charAt(0).toUpperCase()}
                  </div>

                  <div className="mensagens-item-corpo">
                    <div className="mensagens-item-topo">
                      <span className="mensagens-item-nome">{s.nome}</span>
                      <span className="mensagens-item-data">
                        <Calendar size={11} />
                        {formatarData(s.criadoEm)}
                      </span>
                    </div>
                    <span className="mensagens-item-email">{s.email}</span>
                    <div className="mensagens-item-rodape">
                      <span className="mensagens-etiqueta etiqueta-verde">
                        <UserCheck size={10} /> Activo
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Painel de detalhe lateral */}
          {itemAberta && (
            <div className="mensagens-detalhe">
              <div className="mensagens-detalhe-cabecalho">
                <div className="mensagens-detalhe-avatar">
                  {itemAberta.nome.charAt(0).toUpperCase()}
                </div>
                <div className="mensagens-detalhe-info">
                  <h2 className="mensagens-detalhe-nome">{itemAberta.nome}</h2>
                  <p className="mensagens-detalhe-email">
                    <Mail size={13} /> {itemAberta.email}
                  </p>
                </div>
                <button className="mensagens-detalhe-fechar" onClick={() => setItemAberta(null)}>✕</button>
              </div>

              <div className="mensagens-detalhe-meta">
                <span className="mensagens-etiqueta etiqueta-verde">
                   Subscrição Activa
                </span>
                <span className="mensagens-detalhe-data">
                  Inscrito em: {formatarData(itemAberta.criadoEm)}
                </span>
              </div>

              <div className="mensagens-detalhe-conteudo" style={{ minHeight: '100px' }}>
                <p>Este utilizador solicitou receber actualizações sobre protecção costeira e mangais.</p>
              </div>

              <div className="mensagens-detalhe-acoes">
                <a href={`mailto:${itemAberta.email}`} className="mensagens-botao-responder">
                  <Mail size={15} /> Enviar E-mail Directo
                </a>
                <button
                  className="mensagens-botao-eliminar"
                  onClick={() => handleCancelar(itemAberta.email)}
                  disabled={processando === itemAberta.email}
                >
                  {processando === itemAberta.email
                    ? <><Loader2 size={15} className="girando" /> A processar...</>
                    : <><UserX size={15} /> Cancelar Subscrição</>
                  }
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ListaInformativo;