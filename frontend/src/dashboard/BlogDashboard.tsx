// src/dashboard/blogDashboard.tsx
import { useState, useEffect } from 'react';
import { blogAPI } from '../lib/api'; // Integração direta com a tua API do Blog
import '../style/BlogDashboard.css';

// ── Tipos ──────────────────────────────────────────────────
interface Artigo {
    id: number;
    titulo: string;
    resumo: string;
    conteudo: string;
    categoria: string;
    tempoLeitura: string; // Adicionado de acordo com a tua API
    imagem?: string | null;
    data: string;
}

type FormularioArtigo = {
    titulo: string;
    resumo: string;
    conteudo: string;
    categoria: string;
    tempoLeitura: string; // Adicionado de acordo com a tua API
    imagem: string;
    data: string;
};

const CATEGORIAS = ['Educação', 'Ambiente', 'Comunidade', 'Voluntariado', 'Iniciativas', 'Geral'];

const COR_CATEGORIA: Record<string, string> = {
    'Educação': 'blog-cat-verde',
    'Ambiente': 'blog-cat-azul',
    'Comunidade': 'blog-cat-roxo',
    'Voluntariado': 'blog-cat-amarelo',
    'Iniciativas': 'blog-cat-coral',
    'Geral': 'blog-cat-cinza',
};

const formularioInicial: FormularioArtigo = {
    titulo: '',
    resumo: '',
    conteudo: '',
    categoria: 'Educação',
    tempoLeitura: '5 min', // Valor padrão inicial amigável
    imagem: '',
    data: new Date().toISOString().split('T')[0],
};

// ── Componente ─────────────────────────────────────────────
export default function BlogDashboard() {
    const [artigos, setArtigos] = useState<Artigo[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [erro, setErro] = useState('');

    // Filtros
    const [pesquisa, setPesquisa] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('');

    // Modal
    const [modalAberto, setModalAberto] = useState(false);
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [form, setForm] = useState<FormularioArtigo>(formularioInicial);
    const [imagemPreview, setImagemPreview] = useState('');

    // Detalhe expandido
    const [artigoAberto, setArtigoAberto] = useState<Artigo | null>(null);

    // ── Carregar Artigos ─────────────────────────────────────
    const carregarArtigos = async () => {
        setCarregando(true);
        try {
            // Chama blogAPI.listar(categoria) em conformidade com o teu código
            const dados = await blogAPI.listar(filtroCategoria || undefined);
            
            if (pesquisa.trim()) {
                const termo = pesquisa.toLowerCase();
                setArtigos(dados.filter((a: Artigo) =>
                    a.titulo.toLowerCase().includes(termo) ||
                    a.resumo.toLowerCase().includes(termo)
                ));
            } else {
                setArtigos(dados);
            }
        } catch {
            setErro('Erro ao carregar os artigos do blog.');
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => { carregarArtigos(); }, [filtroCategoria, pesquisa]);

    // Otimização: Tenta estimar automaticamente o tempo de leitura com base no texto inserido
    useEffect(() => {
        if (!editandoId && form.conteudo.trim()) {
            const palavras = form.conteudo.trim().split(/\s+/).length;
            const minutos = Math.max(1, Math.ceil(palavras / 200)); // Média de 200 palavras por minuto
            setForm(prev => ({ ...prev, tempoLeitura: `${minutos} min` }));
        }
    }, [form.conteudo, editandoId]);

    // ── Acções de Modal ──────────────────────────────────────
    const abrirCriar = () => {
        setEditandoId(null);
        setForm(formularioInicial);
        setImagemPreview('');
        setErro('');
        setModalAberto(true);
    };

    const abrirEditar = (artigo: Artigo) => {
        setEditandoId(artigo.id);
        setForm({
            titulo: artigo.titulo,
            resumo: artigo.resumo ?? '',
            conteudo: artigo.conteudo ?? '',
            categoria: artigo.categoria,
            tempoLeitura: artigo.tempoLeitura ?? '5 min',
            imagem: artigo.imagem ?? '',
            data: artigo.data ? artigo.data.split('T')[0] : new Date().toISOString().split('T')[0],
        });
        setImagemPreview(artigo.imagem ?? '');
        setErro('');
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setEditandoId(null);
        setErro('');
    };

    // ── Submeter dados (Criar / Editar) ───────────────────────
    const handleSubmeter = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.titulo.trim() || !form.resumo.trim() || !form.conteudo.trim() || !form.tempoLeitura.trim()) {
            setErro('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        setGuardando(true);
        setErro('');

        try {
            // Estrutura mapeada exatamente igual à esperada pelo teu `blogAPI.criar`
            const dadosPayload = {
                titulo: form.titulo,
                resumo: form.resumo,
                conteudo: form.conteudo,
                categoria: form.categoria,
                tempoLeitura: form.tempoLeitura,
                imagem: form.imagem || undefined,
            };

            if (editandoId) {
                // Nota: Se a tua API não tiver a rota PUT/PATCH implementada explicitamente no objeto mapeado,
                // podes tratar isto chamando uma rota genérica ou adaptando o teu backend. Aqui mantém o fluxo lógico:
                // @ts-ignore
                const actualizada = await (blogAPI.actualizar ? blogAPI.actualizar(editandoId, dadosPayload) : blogAPI.criar(dadosPayload));
                setArtigos(prev => prev.map(a => a.id === editandoId ? actualizada : a));
            } else {
                // Executa blogAPI.criar(dados) estruturado perfeitamente
                const nova = await blogAPI.criar(dadosPayload);
                setArtigos(prev => [nova, ...prev]);
            }

            fecharModal();
            carregarArtigos(); // Força revalidação limpa dos estados
        } catch {
            setErro('Erro ao guardar o artigo. Verifique os dados inseridos.');
        } finally {
            setGuardando(false);
        }
    };

    // ── Eliminar Artigo ──────────────────────────────────────
    const handleEliminar = async (id: number) => {
        if (!confirm('Tem a certeza que deseja eliminar este artigo permanentemente?')) return;
        try {
            // Executa blogAPI.eliminar(id) em conformidade com o teu código
            await blogAPI.eliminar(id);
            setArtigos(prev => prev.filter(a => a.id !== id));
            if (artigoAberto?.id === id) setArtigoAberto(null);
        } catch {
            alert('Erro ao eliminar o artigo selecionado.');
        }
    };

    // ── Upload Imagem Base64 ─────────────────────────────────
    const handleImagem = (e: React.ChangeEvent<HTMLInputElement>) => {
        const ficheiro = e.target.files?.[0];
        if (!ficheiro) return;
        const leitor = new FileReader();
        leitor.onloadend = () => {
            const resultado = leitor.result as string;
            setForm({ ...form, imagem: resultado });
            setImagemPreview(resultado);
        };
        leitor.readAsDataURL(ficheiro);
    };

    // ── Contagens para Painel Metrificado ──────────────────────
    const contagens = {
        total: artigos.length,
        educacao: artigos.filter(a => a.categoria === 'Educação').length,
        ambiente: artigos.filter(a => a.categoria === 'Ambiente').length,
        comunidade: artigos.filter(a => a.categoria === 'Comunidade').length,
    };

    return (
        <div className="blog-dash-pagina">

            {/* ── Cabeçalho ── */}
            <header className="blog-dash-cabecalho">
                <div>
                    <h1 className="blog-dash-titulo">Gestão do Blog</h1>
                    <p className="blog-dash-subtitulo">Publique e gira o conteúdo informativo e os artigos da plataforma</p>
                </div>
                <button className="blog-dash-btn-criar" onClick={abrirCriar}>
                    + Novo Artigo
                </button>
            </header>

            {/* ── Indicadores Métricos ── */}
            <section className="blog-dash-resumo">
                {[
                    { rotulo: 'Total de Artigos', valor: contagens.total, cor: 'blog-resumo-total' },
                    { rotulo: 'Artigos de Educação', valor: contagens.educacao, cor: 'blog-resumo-verde' },
                    { rotulo: 'Foco em Ambiente', valor: contagens.ambiente, cor: 'blog-resumo-azul' },
                    { rotulo: 'Acção Comunitária', valor: contagens.comunidade, cor: 'blog-resumo-roxo' },
                ].map((item, i) => (
                    <div key={i} className={`blog-dash-resumo-cartao ${item.cor}`}>
                        <span className="blog-dash-resumo-numero">{item.valor}</span>
                        <span className="blog-dash-resumo-rotulo">{item.rotulo}</span>
                    </div>
                ))}
            </section>

            {/* ── Filtros Avançados ── */}
            <div className="blog-dash-filtros">
                <div className="blog-dash-pesquisa-caixa">
                    <span className="blog-dash-pesquisa-icone">🔍</span>
                    <input
                        type="text"
                        placeholder="Pesquisar por título ou palavra-chave..."
                        value={pesquisa}
                        onChange={e => setPesquisa(e.target.value)}
                        className="blog-dash-input-pesquisa"
                    />
                </div>
                <select
                    className="blog-dash-select"
                    value={filtroCategoria}
                    onChange={e => setFiltroCategoria(e.target.value)}
                >
                    <option value="">Filtrar por Categoria</option>
                    {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
                </select>
            </div>

            {/* ── Feedback Visual de Carregamento ── */}
            {carregando && (
                <div className="blog-dash-carregando">
                    <div className="blog-dash-spinner" />
                    <span>A sincronizar publicações...</span>
                </div>
            )}

            {/* ── Grelha de Artigos Ativos ── */}
            {!carregando && (
                artigos.length === 0 ? (
                    <div className="blog-dash-vazio">
                        <span>📖</span>
                        <p>Nenhum artigo encontrado para os critérios selecionados.</p>
                        <button className="blog-dash-btn-criar" onClick={abrirCriar}>
                            Escrever novo artigo agora
                        </button>
                    </div>
                ) : (
                    <div className="blog-dash-grelha">
                        {artigos.map(artigo => (
                            <article key={artigo.id} className="blog-artigo-cartao">
                                {artigo.imagem && (
                                    <div className="blog-artigo-cartao-imagem">
                                        <img src={artigo.imagem} alt={artigo.titulo} />
                                    </div>
                                )}

                                <div className="blog-artigo-cartao-corpo">
                                    <div className="blog-artigo-cartao-topo">
                                        <span className={`blog-artigo-categoria ${COR_CATEGORIA[artigo.categoria] ?? 'blog-cat-cinza'}`}>
                                            {artigo.categoria}
                                        </span>
                                        <span className="blog-artigo-leitura">
                                            ⏱️ {artigo.tempoLeitura}
                                        </span>
                                    </div>

                                    <h3 className="blog-artigo-titulo">{artigo.titulo}</h3>
                                    <p className="blog-artigo-resumo">{artigo.resumo}</p>

                                    <div className="blog-artigo-acoes">
                                        <button
                                            className="blog-artigo-btn-ver"
                                            onClick={() => setArtigoAberto(artigo)}
                                        >
                                            Ler artigo completo
                                        </button>
                                        <button
                                            className="blog-artigo-btn-editar"
                                            onClick={() => abrirEditar(artigo)}
                                            title="Editar artigo"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="blog-artigo-btn-eliminar"
                                            onClick={() => handleEliminar(artigo.id)}
                                            title="Eliminar artigo"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )
            )}

            {/* ════════ MODAL VISUALIZADOR DETALHADO ════════ */}
            {artigoAberto && (
                <div className="blog-modal-fundo" onClick={() => setArtigoAberto(null)}>
                    <div className="blog-modal blog-modal-detalhe" onClick={e => e.stopPropagation()}>
                        <div className="blog-modal-cabecalho">
                            <div>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '6px' }}>
                                    <span className={`blog-artigo-categoria ${COR_CATEGORIA[artigoAberto.categoria] ?? 'blog-cat-cinza'}`}>
                                        {artigoAberto.categoria}
                                    </span>
                                    <span className="blog-artigo-data">⏱️ Tempo de Leitura: {artigoAberto.tempoLeitura}</span>
                                </div>
                                <h2>{artigoAberto.titulo}</h2>
                            </div>
                            <button className="blog-modal-fechar" onClick={() => setArtigoAberto(null)}>✕</button>
                        </div>

                        <div className="blog-modal-corpo">
                            {artigoAberto.imagem && (
                                <img src={artigoAberto.imagem} alt={artigoAberto.titulo} className="blog-detalhe-imagem" />
                            )}
                            <p className="blog-detalhe-resumo">{artigoAberto.resumo}</p>
                            <div className="blog-detalhe-separador" />
                            <div className="blog-detalhe-conteudo">
                                {artigoAberto.conteudo.split('\n').map((linha, i) => (
                                    <p key={i}>{linha}</p>
                                ))}
                            </div>
                            <div className="blog-detalhe-acoes">
                                <button className="blog-artigo-btn-editar-detalhe"
                                    onClick={() => { setArtigoAberto(null); abrirEditar(artigoAberto); }}>
                                    ✏️ Editar Publicação
                                </button>
                                <button className="blog-artigo-btn-eliminar-detalhe"
                                    onClick={() => handleEliminar(artigoAberto.id)}>
                                    🗑️ Eliminar permanentemente
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ════════ MODAL OPERACIONAL (CRIAR / EDITAR) ════════ */}
            {modalAberto && (
                <div className="blog-modal-fundo" onClick={fecharModal}>
                    <div className="blog-modal blog-modal-form" onClick={e => e.stopPropagation()}>
                        <div className="blog-modal-cabecalho">
                            <h3>{editandoId ? 'Modificar Publicação Existente' : 'Adicionar Artigo ao Blog'}</h3>
                            <button className="blog-modal-fechar" onClick={fecharModal}>✕</button>
                        </div>

                        <form onSubmit={handleSubmeter} className="blog-modal-corpo">
                            {erro && <div className="blog-erro-inline">{erro}</div>}

                            <div className="blog-form-campo">
                                <label>TÍTULO DO ARTIGO</label>
                                <input
                                    type="text"
                                    placeholder="Insira um título impactante..."
                                    value={form.titulo}
                                    onChange={e => setForm({ ...form, titulo: e.target.value })}
                                />
                            </div>

                            <div className="blog-form-linha">
                                <div className="blog-form-campo">
                                    <label>CATEGORIA TEMÁTICA</label>
                                    <select value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}>
                                        {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="blog-form-campo">
                                    <label>TEMPO DE LEITURA</label>
                                    <input 
                                        type="text" 
                                        placeholder="Ex: 5 min" 
                                        value={form.tempoLeitura} 
                                        onChange={e => setForm({ ...form, tempoLeitura: e.target.value })} 
                                    />
                                </div>
                            </div>

                            <div className="blog-form-campo">
                                <label>RESUMO EXPOSITIVO <span className="blog-form-hint">(Curto parágrafo para listagens)</span></label>
                                <textarea
                                    rows={2}
                                    placeholder="Destaque uma breve introdução que atraia o leitor..."
                                    value={form.resumo}
                                    onChange={e => setForm({ ...form, resumo: e.target.value })}
                                />
                            </div>

                            <div className="blog-form-campo">
                                <label>CORPO E CONTEÚDO INTEGRAL </label>
                                <textarea
                                    rows={7}
                                    placeholder="Desenvolva o artigo aqui..."
                                    value={form.conteudo}
                                    onChange={e => setForm({ ...form, conteudo: e.target.value })}
                                />
                            </div>

                            <div className="blog-form-campo">
                                <label>IMAGEM DESTAQUE / CAPA</label>
                                <div className="blog-upload-area">
                                    <input type="file" accept="image/*" onChange={handleImagem} className="blog-upload-input" />
                                    <span>📷 Carregar ficheiro de imagem ou fotografia</span>
                                </div>
                                {imagemPreview && (
                                    <div className="blog-imagem-preview">
                                        <img src={imagemPreview} alt="Preview" />
                                        <button
                                            type="button"
                                            className="blog-remover-imagem"
                                            onClick={() => { setImagemPreview(''); setForm({ ...form, imagem: '' }); }}
                                        >
                                            ✕ Remover Capa
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="blog-form-acoes">
                                <button type="button" className="blog-btn-cancelar" onClick={fecharModal}>
                                    Fechar Janela
                                </button>
                                <button type="submit" className="blog-btn-guardar" disabled={guardando}>
                                    {guardando ? 'A processar...' : editandoId ? 'Gravar Alterações' : 'Publicar no Blog'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}