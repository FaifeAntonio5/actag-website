// src/lib/api.ts
const API_URL = '/api';

async function pedido(endpoint: string, metodo: string = 'GET', corpo?: object) {
  const token = localStorage.getItem('token');

  const resposta = await fetch(`${API_URL}${endpoint}`, {
    method: metodo,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(corpo ? { body: JSON.stringify(corpo) } : {}),
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.erro || 'Erro na comunicação com o servidor.');
  }

  return dados;
}

// ── AUTH ──────────────────────────────────────────────────
export const authAPI = {
  login:  (email: string, senha: string) => pedido('/auth/login', 'POST', { email, senha }),
  perfil: () => pedido('/auth/perfil'),
};

// ── MEMBROS ───────────────────────────────────────────────
export const membrosAPI = {
  listar:     () => 
    pedido('/membros'),
    
  criar:      (dados: { nome: string; email: string; cargo: string }) => 
    pedido('/membros', 'POST', dados),
    
  atualizar: (id: number, dados: { nome?: string; email?: string; cargo?: string; status?: string }) => 
    pedido(`/membros/${id}`, 'PUT', dados),
    
  eliminar:   (id: number) => 
    pedido(`/membros/${id}`, 'DELETE'),
};

// ── VOLUNTÁRIOS ───────────────────────────────────────────
export const voluntariosAPI = {
  listar:     ()                                               => pedido('/voluntarios'),
  criar:      (dados: { nome: string; email: string; projecto: string }) => pedido('/voluntarios', 'POST', dados),
  atualizar: (id: number, dados: object)                     => pedido(`/voluntarios/${id}`, 'PUT', dados),
  eliminar:   (id: number)                                    => pedido(`/voluntarios/${id}`, 'DELETE'),
};

// ── DOADORES ──────────────────────────────────────────────
export const doadoresAPI = {
  listar:  ()                                                  => pedido('/doadores'),
  criar:   (dados: { nome: string; email: string; tipo: string; montante: string }) => pedido('/doadores', 'POST', dados),
  eliminar:(id: number)                                        => pedido(`/doadores/${id}`, 'DELETE'),
};

// ── CONTACTO ──────────────────────────────────────────────
export const contactoAPI = {
  enviar:   (dados: { nome: string; email: string; assunto: string; mensagem: string }) => pedido('/contacto', 'POST', dados),
  listar:   ()                                                  => pedido('/contacto'),
  eliminar: (id: number)                                        => pedido(`/contacto/${id}`, 'DELETE'),
};

// ── DOAÇÕES ───────────────────────────────────────────────
export const doacaoAPI = {
  registar: (dados: { nome: string; email: string; montante: number; frequencia: string; metodo: string }) => pedido('/doacoes', 'POST', dados),
  listar:   ()                                                  => pedido('/doacoes'),
  total:    ()                                                  => pedido('/doacoes/total'),
};

// ── NEWSLETTER ────────────────────────────────────────────
export const newsletterAPI = {
  subscrever: (email: string) => pedido('/newsletter', 'POST', { email }),
};

// ── NOTÍCIAS ──────────────────────────────────────────────
export const noticiasAPI = {
  // Público — usado pelo site
  listar:    (categoria?: string) =>
    pedido(categoria ? `/noticias?categoria=${categoria}` : '/noticias'),

  obter:     (id: number) =>
    pedido(`/noticias/${id}`),

  // Protegido — usado pelo dashboard do editor
  criar: (dados: {
    titulo:    string;
    resumo:    string;
    conteudo:  string;
    categoria: string;
    imagem?:   string;
  }) => pedido('/noticias', 'POST', dados),

  actualizar: (id: number, dados: object) =>
    pedido(`/noticias/${id}`, 'PUT', dados),

  eliminar: (id: number) =>
    pedido(`/noticias/${id}`, 'DELETE'),
};

// ── GALERIA ───────────────────────────────────────────────
export const galeriaAPI = {
  // Público — usado pelo site
  listar: (categoria?: string) =>
    pedido(categoria ? `/galeria?categoria=${categoria}` : '/galeria'),

  // Protegido — usado pelo dashboard do editor
  criar: (dados: {
    src:       string;
    legenda:   string;
    categoria: string;
  }) => pedido('/galeria', 'POST', dados),

  eliminar: (id: number) =>
    pedido(`/galeria/${id}`, 'DELETE'),
};

// ── BLOG ──────────────────────────────────────────────────
export const blogAPI = {
  // Público — usado pelo site
  listar: (categoria?: string) =>
    pedido(categoria ? `/blog?categoria=${categoria}` : '/blog'),

  obter: (id: number) =>
    pedido(`/blog/${id}`),

  // Protegido — usado pelo dashboard do editor
  criar: (dados: {
    titulo:       string;
    resumo:       string;
    conteudo:     string;
    categoria:    string;
    tempoLeitura: string;
    imagem?:      string;
  }) => pedido('/blog', 'POST', dados),

  eliminar: (id: number) =>
    pedido(`/blog/${id}`, 'DELETE'),
};


// frontend/src/lib/api.ts

export const informativoAPI = {

  listar: () => 
    pedido('/newsletter', 'GET'), 

  subscrever: (dados: { nome: string; email: string }) =>
    pedido('/newsletter', 'POST', dados),
  
  cancelarSubscricao: (email: string) =>
    pedido(`/newsletter/${email}`, 'DELETE'), 
};


export const projectosAPI = {

  // ── Projecto principal ──────────────────────────────────
  listar: (filtros?: { estado?: string; categoria?: string; pesquisa?: string }) => {
    const params = new URLSearchParams();
    if (filtros?.estado)    params.append('estado',    filtros.estado);
    if (filtros?.categoria) params.append('categoria', filtros.categoria);
    if (filtros?.pesquisa)  params.append('pesquisa',  filtros.pesquisa);
    const query = params.toString();
    return pedido(query ? `/projectos?${query}` : '/projectos');
  },

  obter: (id: number) =>
    pedido(`/projectos/${id}`),

  estatisticas: () =>
    pedido('/projectos/estatisticas'),

  criar: (dados: {
    nome:                string;
    descricao:           string;
    categoria:           string;
    estado?:             string;
    progresso?:          number;
    meta:                string;
    localizacao:         string;
    orcamento?:          number;
    dataFim?:            string;
    membrosResponsaveis?: { membroId: number; funcao: string }[];
    financiadores?:       { nomeEntidade: string; montante?: number; tipoApoio: string; contacto?: string }[];
    parceiros?:           { nomeEntidade: string; tipoParticipacao: string; contacto?: string }[];
  }) => pedido('/projectos', 'POST', dados),

  actualizar: (id: number, dados: object) =>
    pedido(`/projectos/${id}`, 'PUT', dados),

  eliminar: (id: number) =>
    pedido(`/projectos/${id}`, 'DELETE'),

  // ── Membros responsáveis ────────────────────────────────
  adicionarMembro: (projectoId: number, membroId: number, funcao: string) =>
    pedido(`/projectos/${projectoId}/membros/${membroId}`, 'POST', { membroId, funcao }),

  removerMembro: (projectoId: number, membroId: number) =>
    pedido(`/projectos/${projectoId}/membros/${membroId}`, 'DELETE'),

  // ── Financiadores ───────────────────────────────────────
  adicionarFinanciador: (
    projectoId: number,
    dados: { nomeEntidade: string; montante?: number; tipoApoio: string; contacto?: string }
  ) => pedido(`/projectos/${projectoId}/financiadores`, 'POST', dados),

  removerFinanciador: (projectoId: number, financiadorId: number) =>
    pedido(`/projectos/${projectoId}/financiadores/${financiadorId}`, 'DELETE'),

  // ── Parceiros ───────────────────────────────────────────
  adicionarParceiro: (
    projectoId: number,
    dados: { nomeEntidade: string; tipoParticipacao: string; contacto?: string }
  ) => pedido(`/projectos/${projectoId}/parceiros`, 'POST', dados),

  removerParceiro: (projectoId: number, parceiroId: number) =>
    pedido(`/projectos/${projectoId}/parceiros/${parceiroId}`, 'DELETE'),
};