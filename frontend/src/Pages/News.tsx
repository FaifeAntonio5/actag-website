import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Tag, ArrowRight, Search, Loader2 } from 'lucide-react';
import '../style/News.css';

const News = () => {
  const [noticias, setNoticias] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [pesquisa, setPesquisa] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');

  useEffect(() => {
    const carregarNoticias = async () => {
      try {
        // Tenta buscar do seu backend real
        const res = await fetch('/api/noticias');
        if (res.ok) {
          const dados = await res.json();
          setNoticias(dados);
        }
      } catch (err) {
        console.error("Erro ao carregar notícias do banco:", err);
      } finally {
        setCarregando(false);
      }
    };
    carregarNoticias();
  }, []);

  const categorias = ['Todas', ...Array.from(new Set(noticias.map(n => n.categoria)))];

  const noticiasFiltradas = noticias.filter(noticia => {
    const correspondeCategoria = categoriaActiva === 'Todas' || noticia.categoria === categoriaActiva;
    const correspondePesquisa =
      noticia.titulo.toLowerCase().includes(pesquisa.toLowerCase()) ||
      noticia.resumo.toLowerCase().includes(pesquisa.toLowerCase());
    return correspondeCategoria && correspondePesquisa;
  });

  return (
    <div>
      {/* O HERO QUE VOCÊ PEDIU DE VOLTA */}
      <section className="noticias-cabecalho">
        <div className="noticias-cabecalho-conteudo">
          <span className="noticias-etiqueta">Fique a par das nossas ações</span>
          <h1>Últimas Notícias</h1>
          <p>Acompanhe todas as atividades, conquistas e impacto comunitário da Associação Tagumanicanave em Mocambique.</p>
        </div>
      </section>

      {/* Barra de pesquisa e filtros */}
      <section className="noticias-filtros-area">
        <div className="noticias-filtros-interior">
          <div className="campo-pesquisa">
            <Search size={18} className="icone-pesquisa" />
            <input
              type="text"
              placeholder="Pesquisar notícias..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              className="input-pesquisa"
            />
          </div>

          <div className="filtros-categoria">
            {categorias.map(cat => (
              <button
                key={cat}
                className={`botao-filtro ${categoriaActiva === cat ? 'botao-filtro--activo' : ''}`}
                onClick={() => setCategoriaActiva(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grelha de notícias */}
      <section className="noticias-grelha-area">
        <div className="noticias-grelha-interior">
          
          {carregando ? (
            <div className="noticias-vazio">
              <Loader2 className="girando" size={30} />
              <p>A carregar notícias do banco de dados...</p>
            </div>
          ) : noticiasFiltradas.length === 0 ? (
            <div className="noticias-vazio">
              <p>Nenhuma notícia encontrada no banco de dados. <br/> 
              <small>Use o Painel de Editor para publicar a primeira!</small></p>
            </div>
          ) : (
            <div className="noticias-grelha">
              {noticiasFiltradas.map((noticia) => (
                <article key={noticia.id} className="cartao-noticia">
                  <div className="cartao-noticia-imagem-caixa">
                    <img src={noticia.imagem} alt={noticia.titulo} className="cartao-noticia-imagem" />
                    <span className="cartao-noticia-categoria">
                      <Tag size={12} /> {noticia.categoria}
                    </span>
                  </div>
                  <div className="cartao-noticia-corpo">
                    <div className="cartao-noticia-data">
                      <CalendarDays size={14} />
                      <span>{new Date(noticia.data).toLocaleDateString('pt-MZ')}</span>
                    </div>
                    <h2 className="cartao-noticia-titulo">{noticia.titulo}</h2>
                    <p className="cartao-noticia-resumo">{noticia.resumo}</p>
                    <Link to={`/noticias/${noticia.id}`} className="cartao-noticia-link">
                      Ler a notícia completa <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default News;