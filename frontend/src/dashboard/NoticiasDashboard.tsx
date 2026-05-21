// src/dashboard/NoticiasDashboard.tsx
import { useState, useEffect } from 'react';
import { noticiasAPI } from '../lib/api';
import '../style/NoticiasDashboard.css';

// ── Tipos ──────────────────────────────────────────────────
interface Noticia {
    id: number;
    titulo: string;
    resumo: string;
    conteudo: string;
    categoria: string;
    imagem?: string | null;
    data: string;
    dataFormatada?: string;
}

type FormularioNoticia = {
    titulo: string;
    resumo: string;
    conteudo: string;
    categoria: string;
    imagem: string;
    data: string;
};

const CATEGORIAS = ['Mangais', 'Limpeza', 'Capacitação', 'Acácias', 'Parceria', 'Evento'];

const COR_CATEGORIA: Record<string, string> = {
    'Mangais': 'cat-verde',
    'Limpeza': 'cat-azul',
    'Capacitação': 'cat-roxo',
    'Acácias': 'cat-amarelo',
    'Parceria': 'cat-coral',
    'Evento': 'cat-cinza',
};

const formularioInicial: FormularioNoticia = {
    titulo: '',
    resumo: '',
    conteudo: '',
    categoria: 'Mangais',
    imagem: '',
    data: new Date().toISOString().split('T')[0],
};

// ── Componente ─────────────────────────────────────────────
export default function NoticiasDashboard() {
    const [noticias, setNoticias] = useState<Noticia[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [erro, setErro] = useState('');

    // Filtros
    const [pesquisa, setPesquisa] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('');

    // Modal
    const [modalAberto, setModalAberto] = useState(false);
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [form, setForm] = useState<FormularioNoticia>(formularioInicial);
    const [imagemPreview, setImagemPreview] = useState('');

    // Detalhe expandido
    const [noticiaAberta, setNoticiaAberta] = useState<Noticia | null>(null);

    // ── Carregar ─────────────────────────────────────────────
    const carregarNoticias = async () => {
        setCarregando(true);
        try {
            const dados = await noticiasAPI.listar(filtroCategoria || undefined);
            // Filtro local por pesquisa
            if (pesquisa.trim()) {
                const termo = pesquisa.toLowerCase();
                setNoticias(dados.filter((n: Noticia) =>
                    n.titulo.toLowerCase().includes(termo) ||
                    n.resumo.toLowerCase().includes(termo)
                ));
            } else {
                setNoticias(dados);
            }
        } catch {
            setErro('Erro ao carregar notícias.');
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => { carregarNoticias(); }, [filtroCategoria, pesquisa]);

    // ── Abrir modal para criar ────────────────────────────────
    const abrirCriar = () => {
        setEditandoId(null);
        setForm(formularioInicial);
        setImagemPreview('');
        setErro('');
        setModalAberto(true);
    };

    // ── Abrir modal para editar ───────────────────────────────
    const abrirEditar = (noticia: Noticia) => {
        setEditandoId(noticia.id);
        setForm({
            titulo: noticia.titulo,
            resumo: noticia.resumo ?? '',
            conteudo: noticia.conteudo ?? '',
            categoria: noticia.categoria,
            imagem: noticia.imagem ?? '',
            data: noticia.data ? noticia.data.split('T')[0] : new Date().toISOString().split('T')[0],
        });
        setImagemPreview(noticia.imagem ?? '');
        setErro('');
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setEditandoId(null);
        setErro('');
    };

    // ── Submeter formulário ───────────────────────────────────
    const handleSubmeter = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.titulo.trim() || !form.resumo.trim() || !form.conteudo.trim()) {
            setErro('Título, resumo e conteúdo são obrigatórios.');
            return;
        }

        setGuardando(true);
        setErro('');

        try {
            const dados = {
                titulo: form.titulo,
                resumo: form.resumo,
                conteudo: form.conteudo,
                categoria: form.categoria,
                imagem: form.imagem || undefined,
            };

            if (editandoId) {
                const actualizada = await noticiasAPI.actualizar(editandoId, dados);
                setNoticias(prev => prev.map(n => n.id === editandoId ? actualizada : n));
            } else {
                const nova = await noticiasAPI.criar(dados);
                setNoticias(prev => [nova, ...prev]);
            }

            fecharModal();
        } catch {
            setErro('Erro ao guardar notícia. Tente novamente.');
        } finally {
            setGuardando(false);
        }
    };

    // ── Eliminar ──────────────────────────────────────────────
    const handleEliminar = async (id: number) => {
        if (!confirm('Tem a certeza que deseja eliminar esta notícia?')) return;
        try {
            await noticiasAPI.eliminar(id);
            setNoticias(prev => prev.filter(n => n.id !== id));
            if (noticiaAberta?.id === id) setNoticiaAberta(null);
        } catch {
            alert('Erro ao eliminar notícia.');
        }
    };

    // ── Tratar upload de imagem ───────────────────────────────
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

    // ── Contagens ─────────────────────────────────────────────
    const contagens = {
        total: noticias.length,
        mangais: noticias.filter(n => n.categoria === 'Mangais').length,
        limpeza: noticias.filter(n => n.categoria === 'Limpeza').length,
        parceria: noticias.filter(n => n.categoria === 'Parceria').length,
    };

    // ─────────────────────────────────────────────────────────
    return (
        <div className="noticias-dash-pagina">

            {/* ── Cabeçalho ── */}
            <header className="noticias-dash-cabecalho">
                <div>
                    <h1 className="noticias-dash-titulo">Gestão de Notícias</h1>
                    <p className="noticias-dash-subtitulo">Publique e gira os comunicados e eventos da ACTAG-MZ</p>
                </div>
                <button className="noticias-dash-btn-criar" onClick={abrirCriar}>
                    + Nova Notícia
                </button>
            </header>

            {/* ── Cartões de resumo ── */}
            <section className="noticias-dash-resumo">
                {[
                    { rotulo: 'Total publicadas', valor: contagens.total, cor: 'resumo-total' },
                    { rotulo: 'Mangais', valor: contagens.mangais, cor: 'resumo-verde' },
                    { rotulo: 'Limpeza', valor: contagens.limpeza, cor: 'resumo-azul' },
                    { rotulo: 'Parcerias', valor: contagens.parceria, cor: 'resumo-coral' },
                ].map((item, i) => (
                    <div key={i} className={`noticias-dash-resumo-cartao ${item.cor}`}>
                        <span className="noticias-dash-resumo-numero">{item.valor}</span>
                        <span className="noticias-dash-resumo-rotulo">{item.rotulo}</span>
                    </div>
                ))}
            </section>

            {/* ── Filtros ── */}
            <div className="noticias-dash-filtros">
                <div className="noticias-dash-pesquisa-caixa">
                    <span className="noticias-dash-pesquisa-icone">🔍</span>
                    <input
                        type="text"
                        placeholder="Pesquisar por título ou resumo..."
                        value={pesquisa}
                        onChange={e => setPesquisa(e.target.value)}
                        className="noticias-dash-input-pesquisa"
                    />
                </div>
                <select
                    className="noticias-dash-select"
                    value={filtroCategoria}
                    onChange={e => setFiltroCategoria(e.target.value)}
                >
                    <option value="">Todas as categorias</option>
                    {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
                </select>
            </div>

            {/* ── Estado de carregamento ── */}
            {carregando && (
                <div className="noticias-dash-carregando">
                    <div className="noticias-dash-spinner" />
                    <span>A carregar notícias...</span>
                </div>
            )}

            {/* ── Grelha de notícias ── */}
            {!carregando && (
                noticias.length === 0 ? (
                    <div className="noticias-dash-vazio">
                        <span>📰</span>
                        <p>Nenhuma notícia encontrada.</p>
                        <button className="noticias-dash-btn-criar" onClick={abrirCriar}>
                            Publicar primeira notícia
                        </button>
                    </div>
                ) : (
                    <div className="noticias-dash-grelha">
                        {noticias.map(noticia => (
                            <article key={noticia.id} className="noticia-cartao">

                                {/* Imagem de capa */}
                                {noticia.imagem && (
                                    <div className="noticia-cartao-imagem">
                                        <img src={noticia.imagem} alt={noticia.titulo} />
                                    </div>
                                )}

                                {/* Corpo do cartão */}
                                <div className="noticia-cartao-corpo">

                                    {/* Categoria + Data */}
                                    <div className="noticia-cartao-topo">
                                        <span className={`noticia-categoria ${COR_CATEGORIA[noticia.categoria] ?? 'cat-cinza'}`}>
                                            {noticia.categoria}
                                        </span>
                                        <span className="noticia-data">
                                            {new Date(noticia.data).toLocaleDateString('pt-MZ', {
                                                day: '2-digit', month: 'short', year: 'numeric',
                                            })}
                                        </span>
                                    </div>

                                    {/* Título */}
                                    <h3 className="noticia-titulo">{noticia.titulo}</h3>

                                    {/* Resumo */}
                                    <p className="noticia-resumo">{noticia.resumo}</p>

                                    {/* Acções */}
                                    <div className="noticia-acoes">
                                        <button
                                            className="noticia-btn-ver"
                                            onClick={() => setNoticiaAberta(noticia)}
                                        >
                                            Ver completo
                                        </button>
                                        <button
                                            className="noticia-btn-editar"
                                            onClick={() => abrirEditar(noticia)}
                                            title="Editar"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="noticia-btn-eliminar"
                                            onClick={() => handleEliminar(noticia.id)}
                                            title="Eliminar"
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


            {/* ════════ MODAL DE DETALHE ════════ */}
            {noticiaAberta && (
                <div className="noticias-modal-fundo" onClick={() => setNoticiaAberta(null)}>
                    <div className="noticias-modal noticias-modal-detalhe" onClick={e => e.stopPropagation()}>
                        <div className="noticias-modal-cabecalho">
                            <div>
                                <span className={`noticia-categoria ${COR_CATEGORIA[noticiaAberta.categoria] ?? 'cat-cinza'}`}>
                                    {noticiaAberta.categoria}
                                </span>
                                <h2>{noticiaAberta.titulo}</h2>
                                <span className="noticia-data">
                                    {new Date(noticiaAberta.data).toLocaleDateString('pt-MZ', {
                                        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                                    })}
                                </span>
                            </div>
                            <button className="noticias-modal-fechar" onClick={() => setNoticiaAberta(null)}>✕</button>
                        </div>

                        <div className="noticias-modal-corpo">
                            {noticiaAberta.imagem && (
                                <img src={noticiaAberta.imagem} alt={noticiaAberta.titulo} className="detalhe-imagem" />
                            )}
                            <p className="detalhe-resumo">{noticiaAberta.resumo}</p>
                            <div className="detalhe-separador" />
                            <div className="detalhe-conteudo">
                                {noticiaAberta.conteudo.split('\n').map((linha, i) => (
                                    <p key={i}>{linha}</p>
                                ))}
                            </div>
                            <div className="detalhe-acoes">
                                <button className="noticia-btn-editar-detalhe"
                                    onClick={() => { setNoticiaAberta(null); abrirEditar(noticiaAberta); }}>
                                    ✏️ Editar notícia
                                </button>
                                <button className="noticia-btn-eliminar-detalhe"
                                    onClick={() => handleEliminar(noticiaAberta.id)}>
                                    🗑️ Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* ════════ MODAL DE CRIAR / EDITAR ════════ */}
            {modalAberto && (
                <div className="noticias-modal-fundo" onClick={fecharModal}>
                    <div className="noticias-modal noticias-modal-form" onClick={e => e.stopPropagation()}>

                        <div className="noticias-modal-cabecalho">
                            <h3>{editandoId ? 'Editar Notícia' : 'Nova Notícia'}</h3>
                            <button className="noticias-modal-fechar" onClick={fecharModal}>✕</button>
                        </div>

                        <form onSubmit={handleSubmeter} className="noticias-modal-corpo">
                            {erro && <div className="noticias-erro-inline">{erro}</div>}

                            {/* Título */}
                            <div className="noticias-form-campo">
                                <label>TÍTULO *</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Mutirão de Limpeza na Praia da Beira"
                                    value={form.titulo}
                                    onChange={e => setForm({ ...form, titulo: e.target.value })}
                                />
                            </div>

                            {/* Categoria + Data */}
                            <div className="noticias-form-linha">
                                <div className="noticias-form-campo">
                                    <label>CATEGORIA *</label>
                                    <select value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}>
                                        {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="noticias-form-campo">
                                    <label>DATA DE PUBLICAÇÃO</label>
                                    <input type="date" value={form.data} onChange={e => setForm({ ...form, data: e.target.value })} />
                                </div>
                            </div>

                            {/* Resumo */}
                            <div className="noticias-form-campo">
                                <label>RESUMO * <span className="noticias-form-hint">(aparece no cartão)</span></label>
                                <textarea
                                    rows={2}
                                    placeholder="Breve descrição da notícia..."
                                    value={form.resumo}
                                    onChange={e => setForm({ ...form, resumo: e.target.value })}
                                />
                            </div>

                            {/* Conteúdo */}
                            <div className="noticias-form-campo">
                                <label>CONTEÚDO COMPLETO *</label>
                                <textarea
                                    rows={6}
                                    placeholder="Escreva o conteúdo completo da notícia..."
                                    value={form.conteudo}
                                    onChange={e => setForm({ ...form, conteudo: e.target.value })}
                                />
                            </div>

                            {/* Imagem */}
                            <div className="noticias-form-campo">
                                <label>IMAGEM DE CAPA</label>
                                <div className="noticias-upload-area">
                                    <input type="file" accept="image/*" onChange={handleImagem} className="noticias-upload-input" />
                                    <span>📷 Clique para seleccionar imagem</span>
                                </div>
                                {imagemPreview && (
                                    <div className="noticias-imagem-preview">
                                        <img src={imagemPreview} alt="Pré-visualização" />
                                        <button
                                            type="button"
                                            className="noticias-remover-imagem"
                                            onClick={() => { setImagemPreview(''); setForm({ ...form, imagem: '' }); }}
                                        >
                                            ✕ Remover
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Botões */}
                            <div className="noticias-form-acoes">
                                <button type="button" className="noticias-btn-cancelar" onClick={fecharModal}>
                                    Cancelar
                                </button>
                                <button type="submit" className="noticias-btn-guardar" disabled={guardando}>
                                    {guardando
                                        ? 'A guardar...'
                                        : editandoId ? 'Actualizar Notícia' : 'Publicar Notícia'
                                    }
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}

        </div>
    );
}