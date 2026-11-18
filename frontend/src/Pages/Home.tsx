import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LucideTreeDeciduous,
  LucideWaves,
  LucideUsers,
  LucideHandshake,
  LucideTrendingUp,
  LucideEye,
  LucideBuilding2,
  Loader2
} from "lucide-react";

import '../style/Home.css';
import Carrossel from '../components/Corrossel';

// Importação das imagens dos parceiros
import img1 from "../assets/img/img1-1.png";
import img2 from "../assets/img/img1-2.jpg";
import img3 from "../assets/img/img1-3.png";
import img4 from "../assets/img/img1-4.png";
import img6 from "../assets/img/img1-6.png";
import img5 from '../assets/img/img1-7.jpeg'
import img7 from '../assets/img/img1-8.jpeg'
import img8 from '../assets/img/img1-9.jpeg'
import img9 from '../assets/img/img1-10.jpeg'

const Home = () => {
  const grupo = [img1, img2, img3, img4, img5, img6, img7, img8, img9];

  // Estados para gerir as notícias vindas da API
  const [noticiasRecentes, setNoticiasRecentes] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Hook para carregar dados do Backend
  useEffect(() => {
    const carregarNoticiasHome = async () => {
      try {
        const res = await fetch('/api/noticias');
        if (res.ok) {
          const dados = await res.json();
          // Pegamos apenas as 3 primeiras (o backend já envia ordenado por data desc)
          setNoticiasRecentes(dados.slice(0, 3));
        }
      } catch (err) {
        console.error("Erro ao carregar notícias na Home:", err);
      } finally {
        setCarregando(false);
      }
    };

    carregarNoticiasHome();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Associação Tagumanicanave</h1>
          <p>Dedicamo-nos à proteção e restauração costeira, à adaptação às mudanças climáticas e ao <br />desenvolvimento comunitário sustentável em Moçambique</p>
          <Link to="/sobre">
            <button>Saiba mais sobre nós <span className='seta'>&rarr;</span></button>
          </Link>
        </div>
      </section>

      {/* Eixos de Atuação */}
      <section className="performance">
        <h1>Os Nossos Eixos de Atuação</h1>
        <p className="section-description">
          Trabalhamos na linha da frente da resiliência climática através de ações concretas e baseadas na comunidade.
        </p>

        <div className="performance-container">
          <div className="card">
            <div className="icon-box"><LucideTreeDeciduous /></div>
            <h3>Restauração de Mangais</h3>
            <p>Plantio de milhares de mudas para criar barreiras naturais contra tempestades e marés altas.</p>
          </div>

          <div className="card">
            <div className="icon-box"><LucideWaves /></div>
            <h3>Resiliência Costeira</h3>
            <p>Proteção de dunas e remoção de resíduos sólidos da orla marítima para ecossistemas saudáveis.</p>
          </div>

          <div className="card">
            <div className="icon-box"><LucideUsers /></div>
            <h3>Capacitação Comunitária</h3>
            <p>Educação ambiental e formação de comunidades na gestão de riscos e adaptação climática.</p>
          </div>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="mission">
        <h1>Missão, Visão e Valores</h1>
        <div className="mission-container">
          <div className="card1">
            <div className="icon-box1"><LucideTrendingUp /></div>
            <h3>Nossa Missão</h3>
            <p>Proteger e restaurar os ecossistemas costeiros através do reflorestamento de mangais e dunas, promover a adaptação às mudanças climáticas e capacitar as comunidades na gestão de riscos.</p>
          </div>

          <div className='card1'>
            <div className='icon-box2'><LucideEye /></div>
            <h3>Nossa Visão</h3>
            <p>Ser uma referência nacional em conservação costeira e desenvolvimento comunitário resiliente ao clima em Moçambique.</p>
          </div>

          <div className='card1'>
            <div className='icon-box3'><LucideHandshake /></div>
            <h3>Nossos Valores</h3>
            <ul>
              <li>Inclusão e equidade de género</li>
              <li>Sustentabilidade ambiental</li>
              <li>Solidariedade comunitária</li>
              <li>Transparência e boa governação</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Últimas Notícias (Dinâmicas) */}
      <section className="news">
        <h4>Fique a par das nossas ações</h4>
        <h1>Últimas Notícias</h1>
        <div className='all-news'>
          <p>Fique atualizado sobre as nossas atividades e impacto comunitário na Beira.</p>
          <Link to="/noticias" className='access-all-news'>
            Ver todas as notícias <span>&rarr;</span>
          </Link>
        </div>

        <div className='news-container'>
          {carregando ? (
            <div className="noticias-loading">
              <Loader2 className="animate-spin" size={32} />
              <p>A carregar notícias recentes...</p>
            </div>
          ) : noticiasRecentes.length > 0 ? (
            noticiasRecentes.map(noticia => (
              <div key={noticia.id} className='news-card'>
                <div className="news-card-image">
                  <img src={noticia.imagem} alt={noticia.titulo} />
                </div>
                <div className="news-card-body">
                  <h3>{noticia.titulo}</h3>
                  <p>{noticia.resumo}</p>
                  <Link to={`/noticias/${noticia.id}`} className="read-more">
                    Ler a notícia completa <span>&rarr;</span>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="no-news">Sem notícias publicadas de momento.</p>
          )}
        </div>
      </section>

      {/* Parceiros */}
      <section className='partners'>
        <h4><LucideBuilding2 /> Colaboração para o Impacto</h4>
        <h1>Nossos Parceiros e Financiadores</h1>
        <Carrossel images={grupo} width="150px" height="150px" />
      </section>
    </div>
  );
};

export default Home;