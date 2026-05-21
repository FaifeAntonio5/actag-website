import { useState, useEffect } from 'react';
import { Newspaper, Images, BookOpen, Loader2, X, RefreshCw } from 'lucide-react';
import '../style/DashboardEditor.css';
import { noticiasAPI, galeriaAPI, blogAPI } from '../lib/api';

// ── Tipos ─────────────────────────────────────────────────
type Noticia = { id: number; titulo: string; resumo: string; categoria: string; data: string; };
type FotoGaleria = { id: number; src: string; legenda: string; categoria: string; };
type Artigo = { id: number; titulo: string; resumo: string; categoria: string; tempoLeitura: string; criadoEm: string; };

const DashboardEditor = () => {
  const [abaActiva, setAbaActiva] = useState<'noticias' | 'galeria' | 'blog'>('noticias');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // Dados do backend
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [galeria, setGaleria] = useState<FotoGaleria[]>([]);
  const [artigos, setArtigos] = useState<Artigo[]>([]);

  const utilizador = JSON.parse(localStorage.getItem('utilizador') || '{}');

  // ── Carregar dados do backend ──────────────────────────
  const carregarDados = async () => {
    setCarregando(true);
    setErro('');
    try {
      const [not, gal, art] = await Promise.all([
        noticiasAPI.listar(),
        galeriaAPI.listar(),
        blogAPI.listar(),
      ]);
      setNoticias(not);
      setGaleria(gal);
      setArtigos(art);
    } catch (err: any) {
      setErro(err.message || 'Erro ao carregar dados.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => { carregarDados(); }, []);

  // ── Eliminar ──────────────────────────────────────────
  const eliminarNoticia = async (id: number) => {
    if (!confirm('Eliminar esta notícia?')) return;
    try {
      await noticiasAPI.eliminar(id);
      setNoticias(prev => prev.filter(n => n.id !== id));
    } catch (err: any) { alert(err.message); }
  };

  const eliminarFoto = async (id: number) => {
    if (!confirm('Eliminar esta foto?')) return;
    try {
      await galeriaAPI.eliminar(id);
      setGaleria(prev => prev.filter(f => f.id !== id));
    } catch (err: any) { alert(err.message); }
  };

  const eliminarArtigo = async (id: number) => {
    if (!confirm('Eliminar este artigo?')) return;
    try {
      await blogAPI.eliminar(id);
      setArtigos(prev => prev.filter(a => a.id !== id));
    } catch (err: any) { alert(err.message); }
  };

  return (
    <div className="editor-pagina">

      {/* Cabeçalho Limpo (Sem botões de criação) */}
      <header className="editor-cabecalho">
        <div>
          <h1 className="editor-titulo">Painel do Editor</h1>
          <p className="editor-subtitulo">Olá, {utilizador.nome || 'Editor'} — Gerencie o conteúdo do site</p>
        </div>
        <div className="editor-acoes-cabecalho">
          <button className="editor-btn-actualizar" onClick={carregarDados} disabled={carregando}>
            <RefreshCw size={15} className={carregando ? 'girando' : ''} /> Actualizar
          </button>
        </div>
      </header>

      {/* Sumário */}
      <section className="editor-sumario">
        <div className={`editor-sumario-cartao ${abaActiva === 'noticias' ? 'activo' : ''}`} onClick={() => setAbaActiva('noticias')}>
          <Newspaper size={22} className="editor-sumario-icone icone-verde" />
          <span className="editor-sumario-numero">{noticias.length}</span>
          <span className="editor-sumario-label">Notícias Publicadas</span>
        </div>
        <div className={`editor-sumario-cartao ${abaActiva === 'galeria' ? 'activo' : ''}`} onClick={() => setAbaActiva('galeria')}>
          <Images size={22} className="editor-sumario-icone icone-azul" />
          <span className="editor-sumario-numero">{galeria.length}</span>
          <span className="editor-sumario-label">Fotos na Galeria</span>
        </div>
        <div className={`editor-sumario-cartao ${abaActiva === 'blog' ? 'activo' : ''}`} onClick={() => setAbaActiva('blog')}>
          <BookOpen size={22} className="editor-sumario-icone icone-coral" />
          <span className="editor-sumario-numero">{artigos.length}</span>
          <span className="editor-sumario-label">Artigos de Blog</span>
        </div>
      </section>

      {/* Abas */}
      <div className="editor-abas">
        {(['noticias', 'galeria', 'blog'] as const).map(aba => (
          <button key={aba} className={`editor-aba ${abaActiva === aba ? 'activa' : ''}`} onClick={() => setAbaActiva(aba)}>
            {aba === 'noticias' && <Newspaper size={15} />}
            {aba === 'galeria'  && <Images    size={15} />}
            {aba === 'blog'     && <BookOpen  size={15} />}
            {aba.charAt(0).toUpperCase() + aba.slice(1)}
          </button>
        ))}
      </div>

      {/* Estado de erro ou carregamento */}
      {erro && <div className="editor-erro-mensagem">{erro}</div>}
      {carregando && (
        <div className="editor-carregando">
          <Loader2 size={24} className="girando" />
          <span>A carregar dados...</span>
        </div>
      )}

      {/* ── LISTAGEM DE NOTÍCIAS ── */}
      {!carregando && abaActiva === 'noticias' && (
        <div className="editor-conteudo-caixa">
          <div className="editor-conteudo-cabecalho">
            <h2>Notícias ({noticias.length})</h2>
          </div>
          {noticias.length === 0 ? (
            <p className="editor-placeholder-texto">Nenhuma notícia publicada ainda.</p>
          ) : (
            <table className="editor-tabela">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Categoria</th>
                  <th>Data</th>
                  <th>Acções</th>
                </tr>
              </thead>
              <tbody>
                {noticias.map(n => (
                  <tr key={n.id}>
                    <td className="editor-tabela-titulo">{n.titulo}</td>
                    <td><span className="editor-etiqueta">{n.categoria}</span></td>
                    <td>{new Date(n.data).toLocaleDateString('pt-MZ')}</td>
                    <td>
                      <button className="editor-btn-eliminar" onClick={() => eliminarNoticia(n.id)} title="Eliminar Notícia">
                        <X size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── LISTAGEM DE GALERIA ── */}
      {!carregando && abaActiva === 'galeria' && (
        <div className="editor-conteudo-caixa">
          <div className="editor-conteudo-cabecalho">
            <h2>Galeria ({galeria.length})</h2>
          </div>
          {galeria.length === 0 ? (
            <p className="editor-placeholder-texto">Nenhuma foto na galeria ainda.</p>
          ) : (
            <div className="editor-galeria-grelha">
              {galeria.map(foto => (
                <div key={foto.id} className="editor-galeria-item">
                  <img src={foto.src} alt={foto.legenda} />
                  <div className="editor-galeria-info">
                    <span className="editor-etiqueta">{foto.categoria}</span>
                    <p>{foto.legenda}</p>
                  </div>
                  <button className="editor-galeria-eliminar" onClick={() => eliminarFoto(foto.id)} title="Eliminar Foto">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── LISTAGEM DE BLOG ── */}
      {!carregando && abaActiva === 'blog' && (
        <div className="editor-conteudo-caixa">
          <div className="editor-conteudo-cabecalho">
            <h2>Blog & Artigos ({artigos.length})</h2>
          </div>
          {artigos.length === 0 ? (
            <p className="editor-placeholder-texto">Nenhum artigo publicado ainda.</p>
          ) : (
            <table className="editor-tabela">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Categoria</th>
                  <th>Tempo leitura</th>
                  <th>Data</th>
                  <th>Acções</th>
                </tr>
              </thead>
              <tbody>
                {artigos.map(a => (
                  <tr key={a.id}>
                    <td className="editor-tabela-titulo">{a.titulo}</td>
                    <td><span className="editor-etiqueta">{a.categoria}</span></td>
                    <td>{a.tempoLeitura}</td>
                    <td>{new Date(a.criadoEm).toLocaleDateString('pt-MZ')}</td>
                    <td>
                      <button className="editor-btn-eliminar" onClick={() => eliminarArtigo(a.id)} title="Eliminar Artigo">
                        <X size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

    </div>
  );
};

export default DashboardEditor;