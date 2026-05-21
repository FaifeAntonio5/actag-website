import { useEffect, useRef, useState } from 'react';
import { TreePine, Waves, Users, Leaf, MapPin, ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../style/Impacto.css';

// ── Dados de estatísticas ──────────────────────────────────
const estatisticas = [
  { icone: <Users size={28} />,    numero: 1350,  sufixo: '+',  label: 'Pessoas Beneficiadas',       cor: 'estat-azul'    },
  { icone: <TreePine size={28} />, numero: 3000,  sufixo: '',   label: 'Mudas de Mangal Plantadas',  cor: 'estat-verde'   },
  { icone: <Waves size={28} />,    numero: 117,   sufixo: ' t', label: 'Resíduos Removidos',         cor: 'estat-coral'   },
  { icone: <Leaf size={28} />,     numero: 1142,  sufixo: '+',  label: 'Acácias Plantadas',          cor: 'estat-amarelo' },
];

// ── Linha do tempo ─────────────────────────────────────────
const realizacoes = [
  {
    ano: '2024',
    mes: 'Janeiro',
    titulo: 'Início do Programa de Mangais',
    descricao: 'Lançamento do programa de restauração de mangais no Bairro de Inhamizua com apoio de 80 voluntários locais.',
    icone: <TreePine size={18} />,
    cor: 'verde',
  },
  {
    ano: '2024',
    mes: 'Abril',
    titulo: 'Primeira Grande Limpeza Costeira',
    descricao: 'Remoção de 45 toneladas de resíduos sólidos ao longo de 8km da orla marítima da Beira.',
    icone: <Waves size={18} />,
    cor: 'azul',
  },
  {
    ano: '2024',
    mes: 'Agosto',
    titulo: 'Capacitação de 200 Famílias',
    descricao: 'Workshop de gestão de riscos climáticos atingiu 200 famílias das comunidades costeiras.',
    icone: <Users size={18} />,
    cor: 'coral',
  },
  {
    ano: '2024',
    mes: 'Novembro',
    titulo: 'Plantio de Acácias na Beira',
    descricao: 'Mais de 1.142 acácias plantadas em zonas degradadas da cidade para controlo de erosão.',
    icone: <Leaf size={18} />,
    cor: 'amarelo',
  },
  {
    ano: '2025',
    mes: 'Fevereiro',
    titulo: 'Parceria Internacional Firmada',
    descricao: 'Acordo com ONG internacional para financiamento de 5.000 novas mudas e formação técnica.',
    icone: <TrendingUp size={18} />,
    cor: 'verde',
  },
];

// ── Áreas de actuação (mapa textual) ──────────────────────
const areas = [
  { nome: 'Inhamizua',      descricao: 'Plantio de mangais e limpeza costeira',   lat: '19.8°S', lon: '34.8°E' },
  { nome: 'Rio Ladrão',     descricao: 'Restauração de zonas húmidas e mangais',  lat: '19.9°S', lon: '34.9°E' },
  { nome: 'Praia da Beira', descricao: 'Limpeza da orla e remoção de resíduos',   lat: '19.8°S', lon: '34.8°E' },
  { nome: 'Macuti',         descricao: 'Capacitação comunitária e educação',       lat: '19.8°S', lon: '34.9°E' },
];

// ── Hook para contagem animada ─────────────────────────────
const useContador = (alvo: number, activar: boolean, duracao = 2000) => {
  const [valor, setValor] = useState(0);
  useEffect(() => {
    if (!activar) return;
    let inicio: number;
    const step = (timestamp: number) => {
      if (!inicio) inicio = timestamp;
      const progresso = Math.min((timestamp - inicio) / duracao, 1);
      setValor(Math.floor(progresso * alvo));
      if (progresso < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [activar, alvo, duracao]);
  return valor;
};

// ── Cartão de estatística com contador ────────────────────
const CartaoEstat = ({ item, activar }: { item: typeof estatisticas[0]; activar: boolean }) => {
  const valor = useContador(item.numero, activar);
  return (
    <div className={`impacto-estat-cartao ${item.cor}`}>
      <span className="impacto-estat-icone">{item.icone}</span>
      <p className="impacto-estat-numero">
        {valor.toLocaleString('pt-MZ')}{item.sufixo}
      </p>
      <p className="impacto-estat-label">{item.label}</p>
    </div>
  );
};

// ── Componente principal ───────────────────────────────────
const Impacto = () => {
  const [contadorActivo, setContadorActivo] = useState(false);
  const secaoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setContadorActivo(true); },
      { threshold: 0.3 }
    );
    if (secaoRef.current) observer.observe(secaoRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="impacto-pagina">

      {/* ── Cabeçalho ── */}
      <section className="impacto-cabecalho">
        <div className="impacto-cabecalho-conteudo">
          <span className="impacto-etiqueta">Resultados Reais</span>
          <h1>O Nosso Impacto</h1>
          <p>Cada acção conta. Aqui estão os resultados concretos do nosso trabalho nas comunidades costeiras da Beira entre 2024 e 2025.</p>
        </div>
      </section>

      {/* ── Estatísticas com contador ── */}
      <section className="impacto-estat-secao" ref={secaoRef}>
        <div className="impacto-estat-grelha">
          {estatisticas.map((item, i) => (
            <CartaoEstat key={i} item={item} activar={contadorActivo} />
          ))}
        </div>
      </section>

      {/* ── Mapa de áreas ── */}
      <section className="impacto-mapa-secao">
        <div className="impacto-mapa-interior">
          <div className="impacto-mapa-texto">
            <span className="impacto-secao-etiqueta">
              <MapPin size={14} /> Onde Actuamos
            </span>
            <h2>Áreas de Actuação</h2>
            <p>A nossa acção concentra-se nas zonas costeiras mais vulneráveis da cidade da Beira, Província de Sofala.</p>
            <div className="impacto-areas-lista">
              {areas.map((area, i) => (
                <div key={i} className="impacto-area-item">
                  <span className="impacto-area-ponto" />
                  <div>
                    <strong>{area.nome}</strong>
                    <span>{area.descricao}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/contact" className="impacto-botao-cta">
              Junte-se a nós <ArrowRight size={16} />
            </Link>
          </div>

          {/* Mapa visual estilizado */}
          <div className="impacto-mapa-visual">
            <div className="impacto-mapa-fundo">
              <div className="impacto-mapa-titulo-visual">Cidade da Beira</div>
              <div className="impacto-mapa-subtitulo-visual">Província de Sofala, Moçambique</div>
              {areas.map((area, i) => (
                <div
                  key={i}
                  className={`impacto-mapa-pin pin-${i}`}
                  title={area.nome}
                >
                  <MapPin size={20} />
                  <span className="impacto-mapa-pin-label">{area.nome}</span>
                </div>
              ))}
              <div className="impacto-mapa-oceano">
                <Waves size={18} />
                <span>Oceano Índico</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Linha do tempo ── */}
      <section className="impacto-timeline-secao">
        <div className="impacto-timeline-interior">
          <div className="impacto-timeline-cabecalho">
            <span className="impacto-secao-etiqueta">
              <TrendingUp size={14} /> Cronologia
            </span>
            <h2>As Nossas Realizações</h2>
            <p>Um percurso de acção contínua desde 2024.</p>
          </div>

          <div className="impacto-timeline">
            {realizacoes.map((item, i) => (
              <div key={i} className={`impacto-timeline-item ${i % 2 === 0 ? 'esquerda' : 'direita'}`}>
                <div className="impacto-timeline-conteudo">
                  <div className={`impacto-timeline-icone icone-${item.cor}`}>
                    {item.icone}
                  </div>
                  <div className="impacto-timeline-data">
                    {item.mes} {item.ano}
                  </div>
                  <h3>{item.titulo}</h3>
                  <p>{item.descricao}</p>
                </div>
                <div className="impacto-timeline-linha" />
                <div className="impacto-timeline-ponto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="impacto-cta-secao">
        <div className="impacto-cta-interior">
          <h2>Quer fazer parte desta mudança?</h2>
          <p>Junte-se como voluntário ou apoie com uma doação. Cada contribuição transforma vidas na Beira.</p>
          <div className="impacto-cta-botoes">
            <Link to="/doacao" className="impacto-cta-btn-principal">
              Fazer uma Doação
            </Link>
            <Link to="/contact" className="impacto-cta-btn-secundario">
              Ser Voluntário
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Impacto;