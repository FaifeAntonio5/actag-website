import { useEffect, useState } from 'react';
import { 
  Briefcase, Search, MapPin, 
  Target, Calendar, RefreshCw, AlertCircle, Loader2 
} from 'lucide-react';
import { projectosAPI } from '../lib/api'; // Ajusta o caminho se necessário
import '../style/Projetos.css';

// Interface base para tipar o projeto vindo da tua API
interface Projecto {
  id: number;
  nome: string;
  descricao: string;
  categoria: string;
  estado: string; // Ex: "Planeado", "Em Curso", "Concluído"
  progresso?: number;
  meta: string;
  localizacao: string;
  orcamento?: number;
  dataFim?: string;
}

const Projetos = () => {
  const [projectos, setProjectos] = useState<Projecto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string>('');

  // Estados para os filtros
  const [pesquisa, setPesquisa] = useState<string>('');
  const [categoria, setCategoria] = useState<string>('');
  const [estado, setEstado] = useState<string>('');

  // Função para carregar os dados da API com ou sem filtros
  const carregarProjectos = async () => {
    setLoading(true);
    setErro('');
    try {
      const filtros = {
        pesquisa: pesquisa.trim() || undefined,
        categoria: categoria || undefined,
        estado: estado || undefined,
      };
      const dados = await projectosAPI.listar(filtros);
      setProjectos(dados);
    } catch (err: any) {
      setErro(err.message || 'Não foi possível carregar os projetos da associação.');
    } finally {
      setLoading(false);
    }
  };

  // Recarrega sempre que o utilizador altera os filtros de seleção
  useEffect(() => {
    carregarProjectos();
  }, [categoria, estado]);

  // Função para lidar com o envio da pesquisa de texto (Enter ou clique no botão)
  const handlePesquisaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    carregarProjectos();
  };

  // Helper para renderizar a classe CSS correta conforme o estado do projeto
  const obterClasseEstado = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'concluído': case 'concluido': return 'badge-concluido';
      case 'em curso': case 'execução': return 'badge-curso';
      default: return 'badge-planeado';
    }
  };

  return (
    <div className="projetos-pagina">
      
      {/* Cabeçalho da Página */}
      <section className="projetos-cabecalho">
        <div className="projetos-cabecalho-conteudo">
          <span className="projetos-etiqueta">O Nosso Trabalho</span>
          <h1>Projetos</h1>
          <p>Conheça as nossas intervenções na proteção da biodiversidade, reflorestamento de mangais e desenvolvimento comunitário na Beira.</p>
        </div>
      </section>

      {/* Área de Filtros e Pesquisa */}
      <section className="projetos-filtros-area">
        <form onSubmit={handlePesquisaSubmit} className="projetos-filtros-content">
          
          <div className="busca-input-wrapper">
            <Search size={18} className="busca-icone" />
            <input 
              type="text" 
              placeholder="Pesquisar projeto pelo nome..." 
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              className="busca-input"
            />
            <button type="submit" className="btn-pesquisar">Buscar</button>
          </div>

          <div className="selects-wrapper">
            <div className="select-box">
             
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                <option value="">Todas as Categorias</option>
                <option value="Ambiente">Ambiente</option>
                <option value="Reflorestamento">Reflorestamento</option>
                <option value="Saneamento">Saneamento</option>
                <option value="Educação">Educação</option>
              </select>
            </div>

            <div className="select-box">
              <Briefcase size={16} className="select-icone" />
              <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                <option value="">Todos os Estados</option>
                <option value="Planeado">Planeado</option>
                <option value="Em Curso">Em Curso</option>
                <option value="Concluído">Concluído</option>
              </select>
            </div>
          </div>

        </form>
      </section>

      {/* Corpo da Listagem */}
      <section className="projetos-corpo">
        
        {loading && (
          <div className="projetos-estado-tela">
            <Loader2 size={40} className="projetos-spinner" />
            <p>A carregar os projetos em tempo real direto da base de dados...</p>
          </div>
        )}

        {erro && (
          <div className="projetos-estado-tela erro-caixa">
            <AlertCircle size={32} />
            <p>{erro}</p>
            <button onClick={carregarProjectos} className="btn-recarregar">
              <RefreshCw size={16} /> Tentar Novamente
            </button>
          </div>
        )}

        {!loading && !erro && projectos.length === 0 && (
          <div className="projetos-estado-tela">
            <Briefcase size={40} className="texto-mutado" />
            <p>Nenhum projeto foi encontrado para os filtros selecionados.</p>
          </div>
        )}

        {!loading && !erro && projectos.length > 0 && (
          <div className="projetos-grelha">
            {projectos.map((proj) => (
              <div key={proj.id} className="projeto-card">
                
                <div className="card-topo">
                  <span className="projeto-categoria">{proj.categoria}</span>
                  <span className={`projeto-status-badge ${obterClasseEstado(proj.estado)}`}>
                    {proj.estado}
                  </span>
                </div>

                <div className="card-conteudo">
                  <h3 className="projeto-titulo">{proj.nome}</h3>
                  <p className="projeto-descricao">{proj.descricao}</p>
                  
                  <div className="projeto-detalhes-lista">
                    <div className="detalhe-item">
                      <MapPin size={16} className="detalhe-icone verde" />
                      <span><strong>Local:</strong> {proj.localizacao}</span>
                    </div>
                    
                    <div className="detalhe-item">
                      <Target size={16} className="detalhe-icone amarelo" />
                      <span><strong>Meta:</strong> {proj.meta}</span>
                    </div>

                    {proj.dataFim && (
                      <div className="detalhe-item">
                        <Calendar size={16} className="detalhe-icone" />
                        <span><strong>Previsão de Término:</strong> {new Date(proj.dataFim).toLocaleDateString('pt-MZ')}</span>
                      </div>
                    )}
                  </div>

                  {/* Barra de progresso se houver valor */}
                  {typeof proj.progresso === 'number' && (
                    <div className="projeto-progresso-container">
                      <div className="progresso-texto">
                        <span>Progresso do Projeto</span>
                        <strong>{proj.progresso}%</strong>
                      </div>
                      <div className="progresso-barra-fundo">
                        <div 
                          className="progresso-barra-preenchida" 
                          style={{ width: `${proj.progresso}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default Projetos;