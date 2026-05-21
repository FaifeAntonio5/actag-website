// ──────────────────────────────────────────────────────────
//  FICHEIRO CENTRAL DE NOTÍCIAS
//  Todas as notícias são definidas aqui.
//  O Home mostra as 3 mais recentes automaticamente.
//  A página de Notícias mostra todas.
// ──────────────────────────────────────────────────────────

import img1 from "../assets/img/img1-1.png";
import img2 from "../assets/img/img1-2.jpg";
import img3 from "../assets/img/img1-3.png";
import img4 from "../assets/img/img1-4.png";
import img5 from "../assets/img/img1-5.png";

export type Noticia = {
  id: number;
  titulo: string;
  resumo: string;
  conteudo: string;       // texto completo para a página de detalhe
  imagem: string;
  categoria: string;      // ex: "Mangais", "Limpeza", "Capacitação"
  data: string;           // formato "YYYY-MM-DD" para ordenação
  dataFormatada: string;  // formato legível "12 de Janeiro de 2025"
};

// ↓↓ ADICIONE NOVAS NOTÍCIAS AQUI NO TOPO DA LISTA ↓↓
// O sistema ordena por "data" automaticamente — a mais recente aparece primeiro.

export const todasNoticias: Noticia[] = [
  {
    id: 5,
    titulo: "Parceria com ONG Internacional para Proteção Costeira",
    resumo: "Nova parceria vai financiar o plantio de 5.000 novas mudas de mangal ao longo da orla da Beira.",
    conteudo: `A Associação Tagumanicanave firmou uma parceria estratégica com uma ONG internacional especializada em conservação costeira. O acordo prevê financiamento para o plantio de 5.000 novas mudas de mangal ao longo da orla da Beira durante os próximos 12 meses.

A parceria também inclui capacitação técnica para membros da comunidade local, que serão treinados para monitorar o crescimento das mudas e garantir a sobrevivência das plantas.

"Esta parceria representa um passo gigante para a nossa missão de restaurar os ecossistemas costeiros da Beira", afirmou o presidente da associação.`,
    imagem: img5,
    categoria: "Parceria",
    data: "2025-03-10",
    dataFormatada: "10 de Março de 2025",
  },
  {
    id: 4,
    titulo: "Workshop de Gestão de Resíduos Sólidos na Beira",
    resumo: "Mais de 200 moradores participaram no workshop sobre gestão correta de resíduos sólidos costeiros.",
    conteudo: `O workshop realizado no Bairro de Inhamizua reuniu mais de 200 moradores para discutir práticas sustentáveis de gestão de resíduos sólidos. O evento contou com a presença de especialistas ambientais e representantes do município.

Durante o dia, os participantes aprenderam técnicas de separação de resíduos, compostagem e formas de reduzir o impacto dos plásticos nos ecossistemas marinhos. Crianças das escolas locais também participaram em atividades educativas.`,
    imagem: img4,
    categoria: "Capacitação",
    data: "2025-02-18",
    dataFormatada: "18 de Fevereiro de 2025",
  },
  {
    id: 3,
    titulo: "Capacitação em Gestão de Riscos Climáticos",
    resumo: "Realizamos um workshop para capacitar as comunidades locais na gestão de riscos climáticos e adaptação.",
    conteudo: `O workshop de gestão de riscos climáticos reuniu líderes comunitários, pescadores e moradores do bairro costeiro para discutir estratégias de adaptação face às alterações climáticas.

Os participantes aprenderam a identificar sinais de alerta de tempestades, técnicas de evacuação segura e formas de proteger as suas habitações. O evento foi um sucesso com mais de 150 participantes.`,
    imagem: img3,
    categoria: "Capacitação",
    data: "2025-01-25",
    dataFormatada: "25 de Janeiro de 2025",
  },
  {
    id: 2,
    titulo: "Limpeza da Orla Marítima",
    resumo: "Organizamos uma ação comunitária para remover resíduos sólidos da praia e proteger os ecossistemas.",
    conteudo: `A ação de limpeza da orla marítima contou com a participação de voluntários da comunidade, estudantes universitários e membros da associação. Foram removidos mais de 2 toneladas de resíduos sólidos ao longo de 3 quilómetros de praia.

Entre os resíduos recolhidos destacam-se plásticos, garrafas de vidro e restos de redes de pesca abandonadas. O material recolhido foi devidamente separado e encaminhado para reciclagem.`,
    imagem: img2,
    categoria: "Limpeza",
    data: "2024-12-10",
    dataFormatada: "10 de Dezembro de 2024",
  },
  {
    id: 1,
    titulo: "Plantio de Mudas de Mangue",
    resumo: "Iniciamos um grande plantio de mudas de mangue para fortalecer a proteção costeira da Beira.",
    conteudo: `A Associação Tagumanicanave iniciou a maior campanha de plantio de mangais da sua história. Com o apoio de voluntários locais e parceiros internacionais, foram plantadas 3.000 mudas de mangal ao longo da costa de Inhamizua.

Os mangais são fundamentais para a proteção costeira, servindo de barreira natural contra tempestades e marés altas. Além disso, são habitat de inúmeras espécies marinhas e ajudam a fixar o carbono atmosférico.`,
    imagem: img1,
    categoria: "Mangais",
    data: "2024-11-05",
    dataFormatada: "5 de Novembro de 2024",
  },
];


// Retorna as N notícias mais recentes (usada no Home)
export function obterNoticiasMaisRecentes(quantidade: number = 3): Noticia[] {
  return [...todasNoticias]
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, quantidade);
}

//Depois fazer com que esses dados possam vir de uma pagina do administrador ou a pessoa responsavel pela publicacao de noticias para o site da tagumanicanave