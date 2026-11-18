import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CalendarDays, Tag, ArrowLeft, Loader2 } from 'lucide-react';
import '../style/NewsDatails.css';

const NewsDatails = () => {
  const { id } = useParams();
  const [noticia, setNoticia] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch(`/api/noticias/${id}`)
      .then(res => res.json())
      .then(dados => {
        setNoticia(dados);
        setCarregando(false);
      })
      .catch(() => setCarregando(false));
  }, [id]);

  if (carregando) return <div className="detalhe-carregando"><Loader2 className="girando" /></div>;
  if (!noticia) return <div className="erro">Notícia não encontrada.</div>;

  return (
    <div>
      <div className="detalhe-capa">
        <img src={noticia.imagem} alt={noticia.titulo} className="detalhe-capa-imagem" />
      </div>
      <section className="detalhe-area-principal">
        <div className="detalhe-interior">
          <Link to="/noticias" className="detalhe-voltar-link"><ArrowLeft size={16} /> Voltar</Link>
          <div className="detalhe-meta">
            <span className="detalhe-categoria"><Tag size={13} /> {noticia.categoria}</span>
            <span className="detalhe-data"><CalendarDays size={13} /> {new Date(noticia.data).toLocaleDateString('pt-MZ')}</span>
          </div>
          <h1 className="detalhe-titulo">{noticia.titulo}</h1>
          <div className="detalhe-conteudo">
             {noticia.conteudo.split('\n').map((p: string, i: number) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsDatails;