import React, { useState, useEffect } from 'react';
import { galeriaAPI } from '../lib/api';

interface ImagemGaleria {
  id: number;
  src: string;
  legenda: string;
  categoria: string;
}

export default function GaleriaDashboard() {
  const [imagens, setImagens] = useState<ImagemGaleria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('Todos'); 
  const [modalAberto, setModalAberto] = useState(false);

  const [novaImagem, setNovaImagem] = useState({
    src: '',
    legenda: '',
    categoria: 'Mangais'
  });

  const carregarImagens = async () => {
    setCarregando(true);
    try {
      const categoriaApi = filtroEstado !== 'Todos' ? filtroEstado : undefined;
      const dados = await galeriaAPI.listar(categoriaApi);
      setImagens(dados);
    } catch (erro) {
      console.error("Erro ao carregar galeria do banco:", erro);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarImagens();
  }, [filtroEstado]);

  const eliminarFoto = async (id: number) => {
    if (window.confirm('Desejas mesmo eliminar esta imagem da galeria?')) {
      try {
        await galeriaAPI.eliminar(id);
        setImagens(prev => prev.filter(img => img.id !== id));
      } catch (erro) {
        alert('Erro ao eliminar a imagem do banco.');
      }
    }
  };

  const lidarComSubmissao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaImagem.src || !novaImagem.legenda) {
      alert('Por favor, selecione uma imagem e adicione uma legenda.');
      return;
    }

    try {
      await galeriaAPI.criar(novaImagem);
      setModalAberto(false);
      setNovaImagem({ src: '', legenda: '', categoria: 'Mangais' });
      carregarImagens();
    } catch (erro) {
      alert('Erro ao enviar a imagem para o banco de dados.');
    }
  };

  const obterImagensAgrupadas = () => {
    const grupos: { [chave: string]: ImagemGaleria[] } = {};
    imagens.forEach(img => {
      if (!grupos[img.categoria]) {
        grupos[img.categoria] = [];
      }
      grupos[img.categoria].push(img);
    });
    return grupos;
  };

  const imagensAgrupadas = obterImagensAgrupadas();

  return (
    <div className="editor-pagina">

      {/* Cabeçalho */}
      <div className="editor-cabecalho">
        <div>
          <h2 className="editor-titulo">Galeria de Mídia</h2>
          <p className="editor-subtitulo">Gerencie o acervo visual das atividades e projetos da ACTAG</p>
        </div>
        <button className="editor-btn-novo" onClick={() => setModalAberto(true)}>
          Nova Imagem
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="barra-filtros">
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="Todos">Todas as Categorias</option>
          <option value="Mangais">Mangais</option>
          <option value="Limpeza">Limpeza</option>
          <option value="Capacitação">Capacitação</option>
          <option value="Acácias">Acácias</option>
          <option value="Parceria">Parceria</option>
        </select>
      </div>

      {/* Estado de Carregamento da API */}
      {carregando ? (
        <div className="editor-placeholder-texto">A carregar fotos do banco de dados...</div>
      ) : imagens.length === 0 ? (
        <div className="editor-placeholder-texto">Nenhuma imagem encontrada.</div>
      ) : (
        Object.keys(imagensAgrupadas).map((categoriaChave) => (
          <div key={categoriaChave} className="galeria-grupo-bloco" style={{ marginBottom: '32px' }}>
            <h3 className="projeto-nome" style={{ fontSize: '1.2rem', marginBottom: '16px', color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '8px' }}>
              {categoriaChave}
            </h3>
            
            {/* Grid de Cartões idêntica à dos Projetos */}
            <div className="projetos-grid">
              {imagensAgrupadas[categoriaChave].map((img) => (
                <div className="cartao-projeto" key={img.id}>
                  
                  <div className="projeto-topo">
                    <span className="projeto-categoria">{img.categoria}</span>
                    <span className="badge-estado activo">Mídia</span>
                  </div>

                  {/* Contentor com a imagem adicionada */}
                  <div style={{ width: '100%', height: '180px', overflow: 'hidden', borderRadius: '8px', margin: '12px 0', backgroundColor: '#f8fafc' }}>
                    <img 
                      src={img.src} 
                      alt={img.legenda} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                    />
                  </div>

                  <div className="projeto-meta-dados" style={{ flexGrow: 1 }}>
                    <div className="meta-dado-item" style={{ display: 'block' }}>
                      <strong>Legenda / Descrição:</strong>
                      <span style={{ display: 'block', marginTop: '4px', color: '#475569', lineHeight: '1.4' }}>
                        {img.legenda}
                      </span>
                    </div>
                  </div>

                  {/* Área de Controlos Rápidos */}
                  <div className="projeto-acoes" style={{ marginTop: 'auto', paddingTop: '12px', justifyContent: 'flex-end' }}>
                    <button className="btn-icon-eliminar" onClick={() => eliminarFoto(img.id)} title="Eliminar Imagem">
                      🗑️
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* ── MODAL DE CADASTRO ESPELHADO ── */}
      {modalAberto && (
        <div className="modal-fundo">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-cabecalho">
              <h3>Adicionar Foto à Galeria</h3>
              <button className="modal-fechar" onClick={() => setModalAberto(false)}>×</button>
            </div>

            <form onSubmit={lidarComSubmissao}>
              <div className="modal-corpo">
                
                <div>
                  <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px', display: 'block' }}>
                    Escolher Imagem *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => {
                      const ficheiro = e.target.files?.[0];
                      if (ficheiro) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setNovaImagem({ ...novaImagem, src: reader.result as string });
                        };
                        reader.readAsDataURL(ficheiro);
                      }
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px', display: 'block' }}>
                    Categoria de Destino *
                  </label>
                  <select
                    value={novaImagem.categoria}
                    onChange={(e) => setNovaImagem({ ...novaImagem, categoria: e.target.value })}
                  >
                    <option value="Mangais">Mangais</option>
                    <option value="Limpeza">Limpeza</option>
                    <option value="Capacitação">Capacitação</option>
                    <option value="Acácias">Acácias</option>
                    <option value="Parceria">Parceria</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px', display: 'block' }}>
                    Legenda / Descrição Curta *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Voluntários plantando propágulos de mangal"
                    value={novaImagem.legenda}
                    onChange={(e) => setNovaImagem({ ...novaImagem, legenda: e.target.value })}
                  />
                </div>

                {/* Pré-visualização caso já tenha carregado o ficheiro */}
                {novaImagem.src && (
                  <div style={{ marginTop: '8px' }}>
                    <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px', display: 'block' }}>Pré-visualização:</label>
                    <div style={{ width: '100%', height: '120px', borderRadius: '8px', overflow: 'hidden', border: '1px dashed #cbd5e1' }}>
                      <img src={novaImagem.src} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </div>
                )}

                <div className="modal-acoes-rodape">
                  <button type="button" className="btn-secundario" onClick={() => setModalAberto(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-sucesso">
                    Enviar para Galeria
                  </button>
                </div>

              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}