import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Image, BookOpen, CalendarDays, Tag, ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { galeriaAPI, noticiasAPI } from '../lib/api'; // Ajusta o caminho se necessário
import '../style/Galeria.css';

interface ImagemGaleria {
  id: number;
  src: string;
  legenda: string;
  categoria: string;
}

interface Noticia {
  id: number;
  titulo: string;
  resumo: string;
  conteudo: string;
  categoria: string;
  imagem?: string | null;
  data: string;
}

type AbaType = 'galeria' | 'blog';

const Galeria = () => {
  const [abaActiva, setAbaActiva] = useState<AbaType>('galeria');
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  
  // Estados para dados vindos da API
  const [fotosGaleria, setFotosGaleria] = useState<ImagemGaleria[]>([]);
  const [artigosBlog, setArtigosBlog] = useState<Noticia[]>([]);
  const [carregandoGaleria, setCarregandoGaleria] = useState(true);
  const [carregandoBlog, setCarregandoBlog] = useState(true);

  // Estados do Lightbox
  const [fotoAberta, setFotoAberta] = useState<ImagemGaleria | null>(null);
  const [indiceAberto, setIndiceAberto] = useState(0);

  // ── Carregar Dados do Backend ───────────────────────────
  useEffect(() => {
    const puxarDadosGaleria = async () => {
      try {
        const dados = await galeriaAPI.listar();
        setFotosGaleria(dados);
      } catch (erro) {
        console.error("Erro ao listar fotos da galeria:", erro);
      } finally {
        setCarregandoGaleria(false);
      }
    };

    const puxarDadosBlog = async () => {
      try {
        const dados = await noticiasAPI.listar();
        setArtigosBlog(dados);
      } catch (erro) {
        console.error("Erro ao listar notícias para o blog:", erro);
      } finally {
        setCarregandoBlog(false);
      }
    };

    puxarDadosGaleria();
    puxarDadosBlog();
  }, []);

  // ── Gerar Categorias Dinamicamente com base nas fotos do Banco ──
  const categoriasGaleria = ['Todas', ...Array.from(new Set(fotosGaleria.map(f => f.categoria)))];

  // Filtros aplicados em memória para resposta rápida
  const fotosFiltradas = categoriaActiva === 'Todas'
    ? fotosGaleria
    : fotosGaleria.filter(f => f.categoria === categoriaActiva);

  const abrirFoto = (foto: ImagemGaleria, indice: number) => {
    setFotoAberta(foto);
    setIndiceAberto(indice);
  };

  const navegarFoto = (direccao: 'anterior' | 'proximo') => {
    if (fotosFiltradas.length === 0) return;
    const novoIndice = direccao === 'proximo'
      ? (indiceAberto + 1) % fotosFiltradas.length
      : (indiceAberto - 1 + fotosFiltradas.length) % fotosFiltradas.length;
    setIndiceAberto(novoIndice);
    setFotoAberta(fotosFiltradas[novoIndice]);
  };

  // Função auxiliar para formatar a data vinda do PostgreSQL/Node
  const formatarDataElemento = (dataString: string) => {
    try {
      return new Date(dataString).toLocaleDateString('pt-MZ', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dataString;
    }
  };

  return (
    <div className="galeria-pagina">

      {/* ── Cabeçalho ── */}
      <section className="galeria-cabecalho">
        <div className="galeria-cabecalho-conteudo">
          <span className="galeria-etiqueta">Memórias e Conhecimento</span>
          <h1>Galeria & Blog</h1>
          <p>Veja as nossas acções em imagens e aprofunde o seu conhecimento sobre o ambiente costeiro.</p>
        </div>
      </section>

      {/* ── Abas ── */}
      <div className="galeria-abas-area">
        <div className="galeria-abas">
          <button
            className={`galeria-aba ${abaActiva === 'galeria' ? 'activa' : ''}`}
            onClick={() => setAbaActiva('galeria')}
          >
            <Image size={16} /> Galeria de Fotos
          </button>
          <button
            className={`galeria-aba ${abaActiva === 'blog' ? 'activa' : ''}`}
            onClick={() => setAbaActiva('blog')}
          >
            <BookOpen size={16} /> Blog & Artigos
          </button>
        </div>
      </div>

      {/* ── GALERIA DE FOTOS ── */}
      {abaActiva === 'galeria' && (
        <section className="galeria-fotos-secao">
          <div className="galeria-interior">

            {/* Filtros Dinâmicos */}
            <div className="galeria-filtros">
              {categoriasGaleria.map(cat => (
                <button
                  key={cat}
                  className={`galeria-filtro-btn ${categoriaActiva === cat ? 'activo' : ''}`}
                  onClick={() => setCategoriaActiva(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grelha de fotos com tratamento de carregamento */}
            {carregandoGaleria ? (
              <div className="editor-placeholder-texto">A carregar lembranças da ACTAG...</div>
            ) : fotosFiltradas.length === 0 ? (
              <div className="editor-placeholder-texto">Nenhuma fotografia registada nesta categoria.</div>
            ) : (
              <div className="galeria-grelha">
                {fotosFiltradas.map((foto, i) => (
                  <div
                    key={foto.id}
                    className={`galeria-foto-item ${i === 0 ? 'destaque' : ''}`}
                    onClick={() => abrirFoto(foto, i)}
                  >
                    <img src={foto.src} alt={foto.legenda} className="galeria-foto-img" />
                    <div className="galeria-foto-overlay">
                      <span className="galeria-foto-categoria">{foto.categoria}</span>
                      <p className="galeria-foto-legenda">{foto.legenda}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </section>
      )}

      {/* ── BLOG (NOTÍCIAS DO BANCO) ── */}
      {abaActiva === 'blog' && (
        <section className="galeria-blog-secao">
          <div className="galeria-interior">

            {carregandoBlog ? (
              <div className="editor-placeholder-texto">A carregar publicações recentes...</div>
            ) : artigosBlog.length === 0 ? (
              <div className="editor-placeholder-texto">Nenhum artigo publicado no momento.</div>
            ) : (
              <>
                {/* Artigo mais recente em destaque (Posição 0 do array) */}
                <div className="galeria-blog-destaque">
                  <div className="galeria-blog-destaque-imagem">
                    {artigosBlog[0].imagem ? (
                      <img src={artigosBlog[0].imagem} alt={artigosBlog[0].titulo} />
                    ) : (
                      <div className="editor-placeholder-texto" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                        Sem Imagem
                      </div>
                    )}
                    <span className="galeria-blog-destaque-etiqueta">Mais Recente</span>
                  </div>
                  <div className="galeria-blog-destaque-conteudo">
                    <div className="galeria-blog-meta">
                      <span className="galeria-blog-categoria">
                        <Tag size={12} /> {artigosBlog[0].categoria}
                      </span>
                      <span className="galeria-blog-data">
                        <CalendarDays size={12} /> {formatarDataElemento(artigosBlog[0].data)}
                      </span>
                    </div>
                    <h2>{artigosBlog[0].titulo}</h2>
                    <p>{artigosBlog[0].resumo}</p>
                    <Link to={`/news/${artigosBlog[0].id}`} className="galeria-blog-ler">
                      Ler artigo completo <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>

                {/* Restantes artigos da lista */}
                {artigosBlog.length > 1 && (
                  <div className="galeria-blog-grelha">
                    {artigosBlog.slice(1).map(artigo => (
                      <article key={artigo.id} className="galeria-blog-cartao">
                        <div className="galeria-blog-cartao-imagem">
                          {artigo.imagem ? (
                            <img src={artigo.imagem} alt={artigo.titulo} />
                          ) : (
                            <div style={{ height: '100%', background: '#f1f5f9' }} />
                          )}
                        </div>
                        <div className="galeria-blog-cartao-corpo">
                          <div className="galeria-blog-meta">
                            <span className="galeria-blog-categoria">
                              <Tag size={11} /> {artigo.categoria}
                            </span>
                          </div>
                          <h3>{artigo.titulo}</h3>
                          <p>{artigo.resumo}</p>
                          <div className="galeria-blog-cartao-rodape">
                            <span className="galeria-blog-data">
                              <CalendarDays size={11} /> {formatarDataElemento(artigo.data)}
                            </span>
                            <Link to={`/news/${artigo.id}`} className="galeria-blog-ler-pequeno">
                              Ler <ArrowRight size={13} />
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </>
            )}

          </div>
        </section>
      )}

      {/* ── Lightbox ── */}
      {fotoAberta && (
        <div className="galeria-lightbox" onClick={() => setFotoAberta(null)}>
          <button className="galeria-lightbox-fechar" onClick={() => setFotoAberta(null)}>
            <X size={22} />
          </button>

          <button
            className="galeria-lightbox-nav anterior"
            onClick={e => { e.stopPropagation(); navegarFoto('anterior'); }}
          >
            <ChevronLeft size={28} />
          </button>

          <div className="galeria-lightbox-conteudo" onClick={e => e.stopPropagation()}>
            <img src={fotoAberta.src} alt={fotoAberta.legenda} />
            <div className="galeria-lightbox-info">
              <span className="galeria-foto-categoria">{fotoAberta.categoria}</span>
              <p>{fotoAberta.legenda}</p>
              <span className="galeria-lightbox-contador">
                {indiceAberto + 1} / {fotosFiltradas.length}
              </span>
            </div>
          </div>

          <button
            className="galeria-lightbox-nav proximo"
            onClick={e => { e.stopPropagation(); navegarFoto('proximo'); }}
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}

    </div>
  );
};

export default Galeria;