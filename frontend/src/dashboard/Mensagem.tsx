import { useState, useEffect } from "react";
import {
  Mail, Trash2, Search, RefreshCw,
  Loader2, MessageSquare, Calendar, Tag
} from "lucide-react";
import "../style/Mensagens.css";
import { contactoAPI } from "../lib/api";

// ── Tipo ─────────────────────────────────────────────────────
type Mensagem = {
  id: number;
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
  criadoEm: string;
};

// ── Componente ───────────────────────────────────────────────
const Mensagens = () => {
  const [mensagens,         setMensagens]         = useState<Mensagem[]>([]);
  const [carregando,        setCarregando]         = useState(true);
  const [erro,              setErro]               = useState('');
  const [pesquisa,          setPesquisa]           = useState('');
  const [mensagemAberta,    setMensagemAberta]     = useState<Mensagem | null>(null);
  const [eliminando,        setEliminando]         = useState<number | null>(null);

  // ── Buscar mensagens do backend ──
  const carregarMensagens = async () => {
    setCarregando(true);
    setErro('');
    try {
      const dados = await contactoAPI.listar();
      setMensagens(dados);
    } catch (err: any) {
      setErro(err.message || 'Erro ao carregar mensagens.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarMensagens();
  }, []);

  // ── Eliminar mensagem ──
  const handleEliminar = async (id: number) => {
    if (!confirm('Tem a certeza que deseja eliminar esta mensagem?')) return;
    setEliminando(id);
    try {
      await contactoAPI.eliminar(id);
      setMensagens(prev => prev.filter(m => m.id !== id));
      // Fecha o detalhe se a mensagem aberta for a eliminada
      if (mensagemAberta?.id === id) setMensagemAberta(null);
    } catch (err: any) {
      alert(err.message || 'Erro ao eliminar mensagem.');
    } finally {
      setEliminando(null);
    }
  };

  // ── Filtrar por pesquisa ──
  const mensagensFiltradas = mensagens.filter(m =>
    m.nome.toLowerCase().includes(pesquisa.toLowerCase())    ||
    m.email.toLowerCase().includes(pesquisa.toLowerCase())   ||
    m.assunto.toLowerCase().includes(pesquisa.toLowerCase()) ||
    m.mensagem.toLowerCase().includes(pesquisa.toLowerCase())
  );

  // ── Formatar data ──
  const formatarData = (data: string) =>
    new Date(data).toLocaleDateString('pt-MZ', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  // ── Cor do assunto ──
  const corAssunto = (assunto: string) => {
    if (assunto.includes('Voluntariado')) return 'etiqueta-verde';
    if (assunto.includes('Parceria'))     return 'etiqueta-azul';
    if (assunto.includes('Doação'))       return 'etiqueta-coral';
    if (assunto.includes('Imprensa'))     return 'etiqueta-amarelo';
    return 'etiqueta-cinza';
  };

  return (
    <div className="mensagens-pagina">

      {/* ── Cabeçalho ── */}
      <header className="mensagens-cabecalho">
        <div className="mensagens-cabecalho-esquerda">
          <div className="mensagens-cabecalho-icone">
            <MessageSquare size={22} />
          </div>
          <div>
            <h1 className="mensagens-titulo">Mensagens</h1>
            <p className="mensagens-subtitulo">
              {carregando ? 'A carregar...' : `${mensagens.length} mensagem${mensagens.length !== 1 ? 's' : ''} recebida${mensagens.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        <button className="mensagens-botao-actualizar" onClick={carregarMensagens} disabled={carregando}>
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
            placeholder="Pesquisar por nome, email ou assunto..."
            value={pesquisa}
            onChange={e => setPesquisa(e.target.value)}
            className="mensagens-input-pesquisa"
          />
        </div>
        {pesquisa && (
          <span className="mensagens-resultado-pesquisa">
            {mensagensFiltradas.length} resultado{mensagensFiltradas.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* ── Estado de carregamento ── */}
      {carregando && (
        <div className="mensagens-carregando">
          <Loader2 size={28} className="girando" />
          <span>A carregar mensagens...</span>
        </div>
      )}

      {/* ── Erro ── */}
      {erro && !carregando && (
        <div className="mensagens-erro">
          <p>{erro}</p>
          <button onClick={carregarMensagens} className="mensagens-botao-tentar">
            Tentar novamente
          </button>
        </div>
      )}

      {/* ── Conteúdo principal ── */}
      {!carregando && !erro && (
        <div className="mensagens-corpo">

          {/* Lista de mensagens */}
          <div className={`mensagens-lista ${mensagemAberta ? 'com-detalhe' : ''}`}>
            {mensagensFiltradas.length === 0 ? (
              <div className="mensagens-vazio">
                <Mail size={40} />
                <p>{pesquisa ? 'Nenhuma mensagem encontrada.' : 'Ainda não há mensagens.'}</p>
              </div>
            ) : (
              mensagensFiltradas.map(m => (
                <div
                  key={m.id}
                  className={`mensagens-item ${mensagemAberta?.id === m.id ? 'activa' : ''}`}
                  onClick={() => setMensagemAberta(mensagemAberta?.id === m.id ? null : m)}
                >
                  {/* Avatar com inicial */}
                  <div className="mensagens-item-avatar">
                    {m.nome.charAt(0).toUpperCase()}
                  </div>

                  <div className="mensagens-item-corpo">
                    <div className="mensagens-item-topo">
                      <span className="mensagens-item-nome">{m.nome}</span>
                      <span className="mensagens-item-data">
                        <Calendar size={11} />
                        {formatarData(m.criadoEm)}
                      </span>
                    </div>
                    <span className="mensagens-item-email">{m.email}</span>
                    <div className="mensagens-item-rodape">
                      <span className={`mensagens-etiqueta ${corAssunto(m.assunto)}`}>
                        <Tag size={10} /> {m.assunto}
                      </span>
                      <p className="mensagens-item-preview">
                        {m.mensagem.slice(0, 60)}{m.mensagem.length > 60 ? '...' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Painel de detalhe */}
          {mensagemAberta && (
            <div className="mensagens-detalhe">
              <div className="mensagens-detalhe-cabecalho">
                <div className="mensagens-detalhe-avatar">
                  {mensagemAberta.nome.charAt(0).toUpperCase()}
                </div>
                <div className="mensagens-detalhe-info">
                  <h2 className="mensagens-detalhe-nome">{mensagemAberta.nome}</h2>
                  <a href={`mailto:${mensagemAberta.email}`} className="mensagens-detalhe-email">
                    <Mail size={13} /> {mensagemAberta.email}
                  </a>
                </div>
                <button
                  className="mensagens-detalhe-fechar"
                  onClick={() => setMensagemAberta(null)}
                >
                  ✕
                </button>
              </div>

              <div className="mensagens-detalhe-meta">
                <span className={`mensagens-etiqueta ${corAssunto(mensagemAberta.assunto)}`}>
                  <Tag size={11} /> {mensagemAberta.assunto}
                </span>
                <span className="mensagens-detalhe-data">
                  <Calendar size={13} />
                  {formatarData(mensagemAberta.criadoEm)}
                </span>
              </div>

              <div className="mensagens-detalhe-conteudo">
                <p>{mensagemAberta.mensagem}</p>
              </div>

              <div className="mensagens-detalhe-acoes">
                <a
                  href={`mailto:${mensagemAberta.email}?subject=Re: ${mensagemAberta.assunto}`}
                  className="mensagens-botao-responder"
                >
                  <Mail size={15} /> Responder por Email
                </a>
                <button
                  className="mensagens-botao-eliminar"
                  onClick={() => handleEliminar(mensagemAberta.id)}
                  disabled={eliminando === mensagemAberta.id}
                >
                  {eliminando === mensagemAberta.id
                    ? <><Loader2 size={15} className="girando" /> A eliminar...</>
                    : <><Trash2 size={15} /> Eliminar</>
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

export default Mensagens;