import { useState, useEffect } from "react";
import {
  Users, HandHeart, Heart, TreePine, Waves,
  ArrowUpRight, ArrowDownRight, Activity, CalendarDays, Loader2,
} from "lucide-react";
import "../style/DashboardAdmin.css";
// 1. INTEGRAÇÃO API: Importamos a projectosAPI que configuraste no passo anterior
import { membrosAPI, voluntariosAPI, doacaoAPI, projectosAPI } from "../lib/api";

// ── Tipos ────────────────────────────────────────────────────
type Membro     = { id: number; nome: string; email: string; cargo: string; status: string; criadoEm: string };
type Voluntario = { id: number; nome: string; email: string; projecto: string; status: string; criadoEm: string };
type Doacao     = { id: number; nome: string; email: string; montante: number; frequencia: string; metodo: string; criadoEm: string };
// Novo tipo para mapear os dados reais do teu banco
type Projecto   = { id: number; nome: string; progresso: number; meta: string; voluntarios?: any[] }; 

const DashboardAdmin = () => {
  // ── Estados Dinâmicos (Vindos do Banco de Dados) ───────────
  const [membros,     setMembros]     = useState<Membro[]>([]);
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [doacoes,     setDoacoes]     = useState<Doacao[]>([]);
  const [projectos,   setProjectos]   = useState<Projecto[]>([]); // Transformado em Estado
  const [totalMT,     setTotalMT]     = useState(0);
  const [carregando,  setCarregando]  = useState(true);

  const hoje = new Date().toLocaleDateString("pt-MZ", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  // ── 2. INTEGRAÇÃO API: Buscar tudo em simultâneo ───────────
  useEffect(() => {
    const carregarDadosDashboard = async () => {
      setCarregando(true);
      try {
        const [mem, vol, doc, tot, proj] = await Promise.all([
          membrosAPI.listar(),
          voluntariosAPI.listar(),
          doacaoAPI.listar(),
          doacaoAPI.total(),
          projectosAPI.listar() // Busca os projetos reais do banco
        ]);
        
        setMembros(mem);
        setVoluntarios(vol);
        setDoacoes(doc);
        setTotalMT(tot.total ?? 0);
        setProjectos(proj.slice(0, 4)); // Filtra apenas os 4 primeiros para não quebrar o layout
      } catch (err) {
        console.error('Erro ao carregar dados do dashboard:', err);
      } finally {
        setCarregando(false);
      }
    };

    carregarDadosDashboard();
  }, []);

  // ── 3. GRÁFICO DINÂMICO: Gerar estatísticas mensais a partir das datas reais do banco ──
  const mesesLabels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
  
  const barrasMensais = mesesLabels.map((mes, index) => {
    // Filtra quantos voluntários e doações aconteceram no mês específico deste ano
    const voluntariosDoMes = voluntarios.filter(v => new Date(v.criadoEm).getMonth() === index).length;
    const doacoesDoMes = doacoes.filter(d => new Date(d.criadoEm).getMonth() === index).length;
    
    return {
      mes,
      doacoes: doacoesDoMes,
      voluntarios: voluntariosDoMes
    };
  });

  const maxDoacoes     = Math.max(...barrasMensais.map(b => b.doacoes), 1); // Evita divisão por zero
  const maxVoluntarios = Math.max(...barrasMensais.map(b => b.voluntarios), 1);

  // Cartões dinâmicos com dados reais
  const cartoesSumario = [
    {
      titulo:    "Total de Membros",
      valor:     carregando ? '...' : String(membros.length),
      variacao:  `${membros.filter(m => m.status === 'Ativo').length} activos`,
      positivo:  true,
      icone:     <Users size={22} />,
      corClasse: "cartao-azul",
    },
    {
      titulo:    "Voluntários Activos",
      valor:     carregando ? '...' : String(voluntarios.length),
      variacao:  `${voluntarios.filter(v => v.status === 'Confirmado').length} confirmados`,
      positivo:  true,
      icone:     <HandHeart size={22} />,
      corClasse: "cartao-verde",
    },
    {
      titulo:    "Doações Recebidas",
      valor:     carregando ? '...' : `${totalMT.toLocaleString('pt-MZ')} MT`,
      variacao:  `${doacoes.length} doações`,
      positivo:  true,
      icone:     <Heart size={22} />,
      corClasse: "cartao-coral",
    },
    {
      titulo:    "Mudas Plantadas",
      valor:     "3.142", // Mantido fixo ou pode ser calculado somando metas concluídas
      variacao:  "meta: 5.000",
      positivo:  true,
      icone:     <TreePine size={22} />,
      corClasse: "cartao-amarelo",
    },
  ];

  // Actividade recente gerada a partir dos dados reais
  const actividadeRecente = [
    ...membros.slice(0, 2).map(m => ({
      texto: `${m.nome} foi registado como ${m.cargo}`,
      tempo: new Date(m.criadoEm).toLocaleDateString('pt-MZ'),
      cor: 'azul',
    })),
    ...doacoes.slice(0, 2).map(d => ({
      texto: `${d.nome} realizou uma doação de ${d.montante.toLocaleString('pt-MZ')} MT`,
      tempo: new Date(d.criadoEm).toLocaleDateString('pt-MZ'),
      cor: 'coral',
    })),
    ...voluntarios.slice(0, 2).map(v => ({
      texto: `${v.nome} inscreveu-se no projecto ${v.projecto}`,
      tempo: new Date(v.criadoEm).toLocaleDateString('pt-MZ'),
      cor: 'verde',
    })),
  ].slice(0, 6);

  return (
    <div className="dashboard-pagina">

      {/* Cabeçalho */}
      <header className="dashboard-cabecalho">
        <div>
          <h1 className="dashboard-titulo">Painel de Controlo</h1>
          <p className="dashboard-subtitulo">
            <CalendarDays size={14} /> {hoje}
          </p>
        </div>
        <div className="dashboard-cabecalho-acoes">
          <span className="dashboard-badge-online">
            <span className="dashboard-badge-ponto" />
            {carregando ? 'A carregar...' : 'Sistema activo'}
          </span>
        </div>
      </header>

      {/* Estado de carregamento global */}
      {carregando && (
        <div className="dashboard-carregando">
          <Loader2 size={24} className="dashboard-spinner" />
          <span>A carregar dados do banco...</span>
        </div>
      )}

      {/* Cartões de sumário */}
      {!carregando && (
        <section className="dashboard-cartoes-grelha">
          {cartoesSumario.map((cartao, i) => (
            <div key={i} className={`dashboard-cartao ${cartao.corClasse}`}>
              <div className="dashboard-cartao-topo">
                <span className="dashboard-cartao-icone">{cartao.icone}</span>
                <span className={`dashboard-cartao-variacao ${cartao.positivo ? "positivo" : "negativo"}`}>
                  {cartao.positivo ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {cartao.variacao}
                </span>
              </div>
              <p className="dashboard-cartao-valor">{cartao.valor}</p>
              <p className="dashboard-cartao-titulo">{cartao.titulo}</p>
            </div>
          ))}
        </section>
      )}

      {/* Linha central */}
      {!carregando && (
        <section className="dashboard-linha-central">

          {/* Gráfico Alimentado Dinamicamente */}
          <div className="dashboard-grafico-caixa">
            <div className="dashboard-grafico-cabecalho">
              <div>
                <h2 className="dashboard-secao-titulo">Actividade Mensal</h2>
                <p className="dashboard-secao-sub">Métricas em tempo real — 2026</p>
              </div>
              <div className="dashboard-grafico-legenda">
                <span className="legenda-item legenda-doacoes">Doações Registadas</span>
                <span className="legenda-item legenda-voluntarios">Voluntários Inscritos</span>
              </div>
            </div>
            <div className="dashboard-barras">
              {barrasMensais.map((b, i) => (
                <div key={i} className="dashboard-barra-grupo">
                  <div className="dashboard-barra-par">
                    <div className="dashboard-barra barra-doacoes"
                      style={{ height: `${(b.doacoes / maxDoacoes) * 100}%` }}
                      title={`${b.doacoes} doações`} />
                    <div className="dashboard-barra barra-voluntarios"
                      style={{ height: `${(b.voluntarios / maxVoluntarios) * 100}%` }}
                      title={`${b.voluntarios} voluntários`} />
                  </div>
                  <span className="dashboard-barra-label">{b.mes}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lista de Projectos Reais do Banco de Dados */}
          <div className="dashboard-projectos-caixa">
            <div className="dashboard-grafico-cabecalho">
              <div>
                <h2 className="dashboard-secao-titulo">Projectos Activos</h2>
                <p className="dashboard-secao-sub">Progresso actual no banco</p>
              </div>
              <Waves size={18} className="dashboard-secao-icone-decorativo" />
            </div>
            <div className="dashboard-projectos-lista">
              {projectos.length === 0 ? (
                <p className="dashboard-vazio">Nenhum projeto ativo encontrado.</p>
              ) : (
                projectos.map((proj) => (
                  <div key={proj.id} className="dashboard-projecto-item">
                    <div className="dashboard-projecto-topo">
                      <span className="dashboard-projecto-nome">{proj.nome}</span>
                      <span className="dashboard-projecto-pct">{proj.progresso}%</span>
                    </div>
                    <div className="dashboard-barra-progresso-fundo">
                      <div className="dashboard-barra-progresso-fill" style={{ width: `${proj.progresso}%` }} />
                    </div>
                    <div className="dashboard-projecto-rodape">
                      {/* Conta o número de voluntários vinculados a este projeto se o Prisma trouxer a relação */}
                      <span><Users size={12} /> {proj.voluntarios?.length || 0} voluntários</span>
                      <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        Meta: {proj.meta}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </section>
      )}

      {/* Actividade recente */}
      {!carregando && (
        <section className="dashboard-actividade-caixa">
          <div className="dashboard-grafico-cabecalho">
            <div>
              <h2 className="dashboard-secao-titulo">Actividade Recente</h2>
              <p className="dashboard-secao-sub">Últimas acções registadas</p>
            </div>
            <Activity size={18} className="dashboard-secao-icone-decorativo" />
          </div>

          {actividadeRecente.length === 0 ? (
            <p className="dashboard-vazio">Nenhuma actividade registada ainda.</p>
          ) : (
            <div className="dashboard-actividade-lista">
              {actividadeRecente.map((item, i) => (
                <div key={i} className="dashboard-actividade-item">
                  <span className={`dashboard-actividade-ponto ponto-${item.cor}`} />
                  <span className="dashboard-actividade-texto">{item.texto}</span>
                  <span className="dashboard-actividade-tempo">{item.tempo}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

    </div>
  );
};

export default DashboardAdmin;