import { useState } from 'react';
import {
  Mail, Phone, MapPin, Clock, Send,
  CheckCircle, Loader2
} from 'lucide-react';
import '../style/Contact.css';
import { contactoAPI } from '../lib/api';
import { FaFacebookF, FaInstagram, FaLinkedin} from 'react-icons/fa';

const Contacto = () => {
  const [formulario, setFormulario] = useState({
    nome: '',
    email: '',
    assunto: 'Geral / Informações',
    mensagem: '',
    projecto: '' 
  });
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro]       = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
    setErro('');
  };

  const handleEnviar = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!formulario.nome.trim() || !formulario.email.trim() || !formulario.mensagem.trim()) {
      setErro('Por favor preencha todos os campos obrigatórios.');
      return;
    }

    // Se escolheu voluntariado, valida se preencheu o nome do projeto
    if (formulario.assunto === 'Voluntariado' && !formulario.projecto.trim()) {
      setErro('Por favor, indique em qual projeto ou área gostaria de trabalhar.');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      await contactoAPI.enviar(formulario);
      setEnviado(true);
      // Limpa todo o formulário após o sucesso
      setFormulario({ nome: '', email: '', assunto: 'Geral / Informações', mensagem: '', projecto: '' });
      setTimeout(() => setEnviado(false), 6000);
    } catch (err: any) {
      setErro(err.message || 'Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const cartoesTopo = [
    { icone: <Mail size={22} />,  corIcone: 'icone-email',       titulo: 'Email Oficial',         linha1: 'info@actagmz.org',          linha2: 'Respondemos em 24 horas úteis' },
    { icone: <Phone size={22} />, corIcone: 'icone-telefone',    titulo: 'Telefone',               linha1: '+258 87 190 5800',             linha2: 'Disponível Segunda a Sexta'       },
    { icone: <MapPin size={22} />,corIcone: 'icone-localizacao', titulo: 'Nossa Sede',             linha1: 'Cidade da Beira, Moçambique',  linha2: 'Bairro Central, Rua X, No. Y'    },
  ];

  const horarios = [
    { dia: 'Segunda - Sexta', hora: '08:00 - 17:00', encerrado: false },
    { dia: 'Sábado',          hora: '09:00 - 13:00', encerrado: false },
    { dia: 'Domingo',         hora: 'Encerrado',     encerrado: true  },
  ];

  const perguntas = [
    { pergunta: 'Como posso ser voluntário?',             resposta: 'Pode preencher o nosso formulário de contacto ou visitar a nossa sede na Beira. Realizamos campanhas mensais de limpeza e plantação.' },
    { pergunta: 'A ACTAG-MZ aceita doações de materiais?',resposta: 'Sim, aceitamos doações de ferramentas de limpeza, sementes de mangal e equipamentos de proteção para os nossos voluntários.'         },
    { pergunta: 'Onde atuam exatamente?',                 resposta: 'O nosso foco principal é a cidade da Beira, especificamente na orla marítima e zonas de mangal como o Rio Ladrão e Inhamizua.'       },
  ];

  return (
    <div className="contacto-pagina">

      <section className="contacto-cabecalho">
        <div className="contacto-cabecalho-conteudo">
          <span className="contacto-etiqueta">Entre em Contacto</span>
          <h1>Fale Connosco</h1>
          <p>Estamos disponíveis para responder às suas questões, receber voluntários e parceiros.</p>
        </div>
      </section>

      <section className="contacto-cartoes-area">
        <div className="contacto-cartoes-grelha">
          {cartoesTopo.map((cartao, i) => (
            <div key={i} className="contacto-cartao">
              <span className={`contacto-cartao-icone ${cartao.corIcone}`}>{cartao.icone}</span>
              <div className="contacto-cartao-texto">
                <strong>{cartao.titulo}</strong>
                <span>{cartao.linha1}</span>
                <small>{cartao.linha2}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="contacto-corpo">
        <div className="contacto-corpo-interior">

          <div className="contacto-formulario-caixa">
            <h2 className="contacto-formulario-titulo">
              <Send size={20} className="contacto-formulario-icone-titulo" />
              Envie-nos uma Mensagem
            </h2>

            {enviado && (
              <div className="contacto-sucesso">
                <CheckCircle size={18} />
                Mensagem enviada com sucesso! Responderemos em breve.
              </div>
            )}

            {erro && (
              <div className="contacto-erro">
                {erro}
              </div>
            )}

            <div className="contacto-formulario-linha">
              <div className="contacto-campo">
                <label className="contacto-label">SEU NOME</label>
                <input type="text" name="nome" placeholder="Nome completo"
                  value={formulario.nome} onChange={handleChange}
                  className="contacto-input" disabled={loading} />
              </div>
              <div className="contacto-campo">
                <label className="contacto-label">SEU EMAIL</label>
                <input type="email" name="email" placeholder="email@exemplo.com"
                  value={formulario.email} onChange={handleChange}
                  className="contacto-input" disabled={loading} />
              </div>
            </div>

            <div className="contacto-campo">
              <label className="contacto-label">ASSUNTO</label>
              <select name="assunto" value={formulario.assunto}
                onChange={handleChange} className="contacto-select" disabled={loading}>
                <option>Geral / Informações</option>
                <option>Voluntariado</option>
                <option>Parceria</option>
                <option>Doação</option>
                <option>Imprensa / Media</option>
              </select>
            </div>

            {/* SEGREDO: O campo abaixo só aparece se o assunto selecionado for Voluntariado */}
            {formulario.assunto === 'Voluntariado' && (
              <div className="contacto-campo">
                <label className="contacto-label">PROJETO OU ÁREA DE INTERESSE</label>
                <input type="text" name="projecto" placeholder="Ex: Plantação de Mangais, Limpeza da Orla Marítima..."
                  value={formulario.projecto} onChange={handleChange}
                  className="contacto-input" disabled={loading} />
              </div>
            )}

            <div className="contacto-campo">
              <label className="contacto-label">SUA MENSAGEM</label>
              <textarea name="mensagem" placeholder="Como podemos ajudar?"
                value={formulario.mensagem} onChange={handleChange}
                className="contacto-textarea" rows={6} disabled={loading} />
            </div>

            <button className="contacto-botao-enviar" onClick={handleEnviar} disabled={loading}>
              {loading
                ? <><Loader2 size={16} className="contacto-spinner" /> A enviar...</>
                : <>Enviar Mensagem <Send size={16} /></>
              }
            </button>
          </div>

          <div className="contacto-sidebar">
            <div className="contacto-sidebar-bloco">
              <h3 className="contacto-sidebar-titulo">
                <Clock size={18} className="contacto-sidebar-icone-titulo amarelo" />
                Horário de Funcionamento
              </h3>
              <div className="contacto-horario-lista">
                {horarios.map((h, i) => (
                  <div key={i} className={`contacto-horario-linha ${h.encerrado ? 'encerrado' : ''}`}>
                    <span>{h.dia}</span>
                    <span className={h.encerrado ? 'contacto-encerrado-texto' : 'contacto-hora-texto'}>{h.hora}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="contacto-sidebar-bloco">
              <h3 className="contacto-sidebar-titulo">
                <CheckCircle size={18} className="contacto-sidebar-icone-titulo azul" />
                Perguntas Frequentes
              </h3>
              <div className="contacto-faq-lista">
                {perguntas.map((item, i) => (
                  <div key={i} className="contacto-faq-item">
                    <span className="contacto-faq-pergunta">
                      <CheckCircle size={15} className="contacto-faq-icone" />
                      {item.pergunta}
                    </span>
                    <p className="contacto-faq-resposta">{item.resposta}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="contacto-sidebar-bloco">
              <p className="contacto-redes-titulo">Siga-nos nas redes sociais</p>
              <div className="contacto-redes-botoes">
                <a href="#" className="contacto-rede-btn" aria-label="Facebook">
                  <FaFacebookF size={16} />
                </a>
                <a href="#" className="contacto-rede-btn" aria-label="Instagram">
                  <FaInstagram size={16} />
                </a>
                <a href="#" className="contacto-rede-btn" aria-label="LinkedIn">
                  <FaLinkedin size={16} />
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Contacto;