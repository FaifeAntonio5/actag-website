import { useState } from 'react';
import { Heart, TreePine, Waves, Users, CheckCircle, CreditCard, Smartphone, Building2, ChevronRight, Loader2 } from 'lucide-react';
import '../style/Doacao.css';
import { doacaoAPI } from '../lib/api';

type FrequenciaType = 'unica' | 'mensal';

const Doacao = () => {
  const [valor, setValor]                       = useState<number | ''>('');
  const [valorPersonalizado, setValorPersonalizado] = useState('');
  const [frequencia, setFrequencia]             = useState<FrequenciaType>('unica');
  const [metodoPagamento, setMetodoPagamento]   = useState('mpesa');
  const [etapa, setEtapa]                       = useState<1 | 2 | 3>(1);
  const [nome, setNome]                         = useState('');
  const [email, setEmail]                       = useState('');
  const [doado, setDoado]                       = useState(false);
  const [loading, setLoading]                   = useState(false);
  const [erro, setErro]                         = useState('');

  const valoresSugeridos = [100, 250, 500, 1000, 2500];

  const impactos = [
    { icone: <TreePine size={22} />, valor: 100,  descricao: 'Planta 5 mudas de mangal'               },
    { icone: <Waves size={22} />,    valor: 250,  descricao: 'Remove 10kg de resíduos costeiros'       },
    { icone: <Users size={22} />,    valor: 500,  descricao: 'Capacita 1 voluntário comunitário'       },
    { icone: <Heart size={22} />,    valor: 1000, descricao: 'Financia uma acção de limpeza completa'  },
  ];

  const metodos = [
    { id: 'mpesa',         icone: <Smartphone size={18} />, label: 'M-Pesa'        },
    { id: 'cartao',        icone: <CreditCard size={18} />, label: 'Cartão'        },
    { id: 'transferencia', icone: <Building2 size={18} />,  label: 'Transferência' },
  ];

  const valorFinal = valorPersonalizado ? Number(valorPersonalizado) : valor;

  const handleConfirmar = () => {
    if (!valorFinal || Number(valorFinal) <= 0) return;
    setEtapa(2);
  };

  const handleDoacaoFinal = async () => {
    if (!nome.trim() || !email.trim()) {
      setErro('Nome e email são obrigatórios.');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      await doacaoAPI.registar({
        nome,
        email,
        montante: Number(valorFinal),
        frequencia,
        metodo: metodoPagamento,
      });
      setDoado(true);
      setEtapa(3);
    } catch (err: any) {
      setErro(err.message || 'Erro ao registar doação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const reiniciar = () => {
    setEtapa(1);
    setValor('');
    setValorPersonalizado('');
    setNome('');
    setEmail('');
    setDoado(false);
    setErro('');
    setFrequencia('unica');
    setMetodoPagamento('mpesa');
  };

  return (
    <div className="doacao-pagina">

      <section className="doacao-cabecalho">
        <div className="doacao-cabecalho-conteudo">
          <span className="doacao-etiqueta">Faça a Diferença</span>
          <h1>Apoie a Nossa Missão</h1>
          <p>A sua doação protege os ecossistemas costeiros da Beira e fortalece as comunidades locais.</p>
        </div>
      </section>

      {/* Indicador de etapas */}
      <div className="doacao-etapas-barra">
        <div className="doacao-etapas-interior">
          {['Escolher valor', 'Seus dados', 'Confirmação'].map((label, i) => (
            <div key={i} className={`doacao-etapa-item ${etapa > i ? 'concluida' : ''} ${etapa === i + 1 ? 'activa' : ''}`}>
              <span className="doacao-etapa-numero">
                {etapa > i + 1 ? <CheckCircle size={14} /> : i + 1}
              </span>
              <span className="doacao-etapa-label">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="doacao-corpo">
        <div className="doacao-corpo-interior">

          {/* ── ETAPA 1 ── */}
          {etapa === 1 && (
            <div className="doacao-caixa-principal">
              <h2 className="doacao-secao-titulo">
                <Heart size={20} className="doacao-secao-icone" /> Escolha o valor da doação
              </h2>

              <div className="doacao-frequencia">
                {(['unica', 'mensal'] as FrequenciaType[]).map(f => (
                  <button key={f}
                    className={`doacao-frequencia-btn ${frequencia === f ? 'activo' : ''}`}
                    onClick={() => setFrequencia(f)}>
                    {f === 'unica' ? 'Doação Única' : 'Doação Mensal'}
                  </button>
                ))}
              </div>

              <div className="doacao-valores-grelha">
                {valoresSugeridos.map(v => (
                  <button key={v}
                    className={`doacao-valor-btn ${valor === v && !valorPersonalizado ? 'activo' : ''}`}
                    onClick={() => { setValor(v); setValorPersonalizado(''); }}>
                    {v.toLocaleString('pt-MZ')} MZN
                  </button>
                ))}
                <input
                  type="number"
                  placeholder="Outro valor (MZN)"
                  value={valorPersonalizado}
                  onChange={e => { setValorPersonalizado(e.target.value); setValor(''); }}
                  className={`doacao-valor-personalizado ${valorPersonalizado ? 'activo' : ''}`}
                />
              </div>

              {valorFinal && Number(valorFinal) > 0 && (
                <div className="doacao-impacto-caixa">
                  <p className="doacao-impacto-titulo">
                    Com {Number(valorFinal).toLocaleString('pt-MZ')} MZN você pode:
                  </p>
                  <div className="doacao-impacto-lista">
                    {impactos.filter(imp => Number(valorFinal) >= imp.valor).map((imp, i) => (
                      <div key={i} className="doacao-impacto-item">
                        <span className="doacao-impacto-icone">{imp.icone}</span>
                        <span>{imp.descricao}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="doacao-metodos">
                <p className="doacao-metodos-titulo">Método de pagamento</p>
                <div className="doacao-metodos-opcoes">
                  {metodos.map(m => (
                    <button key={m.id}
                      className={`doacao-metodo-btn ${metodoPagamento === m.id ? 'activo' : ''}`}
                      onClick={() => setMetodoPagamento(m.id)}>
                      {m.icone} {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <button className="doacao-botao-continuar" onClick={handleConfirmar}
                disabled={!valorFinal || Number(valorFinal) <= 0}>
                Continuar <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* ── ETAPA 2 ── */}
          {etapa === 2 && (
            <div className="doacao-caixa-principal">
              <h2 className="doacao-secao-titulo">
                <Users size={20} className="doacao-secao-icone" /> Os seus dados
              </h2>

              <div className="doacao-resumo-valor">
                <span>Doação {frequencia === 'mensal' ? 'mensal' : 'única'}</span>
                <strong>{Number(valorFinal).toLocaleString('pt-MZ')} MZN</strong>
              </div>

              {/* Erro da etapa 2 */}
              {erro && <div className="doacao-erro">{erro}</div>}

              <div className="doacao-campo">
                <label className="doacao-label">NOME COMPLETO</label>
                <input type="text" placeholder="O seu nome"
                  value={nome} onChange={e => { setNome(e.target.value); setErro(''); }}
                  className="doacao-input" disabled={loading} />
              </div>

              <div className="doacao-campo">
                <label className="doacao-label">EMAIL</label>
                <input type="email" placeholder="email@exemplo.com"
                  value={email} onChange={e => { setEmail(e.target.value); setErro(''); }}
                  className="doacao-input" disabled={loading} />
              </div>

              {metodoPagamento === 'mpesa' && (
                <div className="doacao-campo">
                  <label className="doacao-label">NÚMERO M-PESA</label>
                  <input type="tel" placeholder="+258 8X XXX XXXX" className="doacao-input" disabled={loading} />
                </div>
              )}

              {metodoPagamento === 'transferencia' && (
                <div className="doacao-info-banco">
                  <p><strong>Dados bancários:</strong></p>
                  <p>Banco: BCI Moçambique</p>
                  <p>IBAN: MZ59 0000 0000 0000 0000 000</p>
                  <p>Referência: DOACAO-ACTAG</p>
                </div>
              )}

              <div className="doacao-botoes-linha">
                <button className="doacao-botao-voltar" onClick={() => setEtapa(1)} disabled={loading}>
                  Voltar
                </button>
                <button className="doacao-botao-continuar" onClick={handleDoacaoFinal}
                  disabled={!nome || !email || loading}>
                  {loading
                    ? <><Loader2 size={16} className="doacao-spinner" /> A processar...</>
                    : <>Confirmar Doação <ChevronRight size={18} /></>
                  }
                </button>
              </div>
            </div>
          )}

          {/* ── ETAPA 3 ── */}
          {etapa === 3 && doado && (
            <div className="doacao-caixa-confirmacao">
              <div className="doacao-confirmacao-icone">
                <CheckCircle size={56} />
              </div>
              <h2>Obrigado, {nome.split(' ')[0]}!</h2>
              <p>
                A sua doação de{' '}
                <strong>{Number(valorFinal).toLocaleString('pt-MZ')} MZN</strong>{' '}
                foi registada com sucesso.
              </p>
              <p className="doacao-confirmacao-sub">
                Enviámos uma confirmação para <strong>{email}</strong>.
              </p>
              <div className="doacao-confirmacao-impacto">
                <TreePine size={24} />
                <span>Juntos vamos restaurar os mangais da Beira. Muito obrigado pelo seu apoio!</span>
              </div>
              <button className="doacao-botao-continuar" onClick={reiniciar}>
                Fazer nova doação
              </button>
            </div>
          )}

          {/* Sidebar de confiança */}
          {etapa !== 3 && (
            <div className="doacao-sidebar">
              <div className="doacao-sidebar-bloco">
                <h3>Por que doar?</h3>
                <ul className="doacao-sidebar-lista">
                  <li><CheckCircle size={15} /> 100% das doações vão para projectos na Beira</li>
                  <li><CheckCircle size={15} /> Relatórios de impacto enviados por email</li>
                  <li><CheckCircle size={15} /> Associação registada e transparente</li>
                  <li><CheckCircle size={15} /> Recibo fiscal disponível a pedido</li>
                </ul>
              </div>
              <div className="doacao-sidebar-bloco doacao-sidebar-estatisticas">
                <h3>O nosso impacto</h3>
                <div className="doacao-estat-item">
                  <span className="doacao-estat-numero">3.000</span>
                  <span className="doacao-estat-desc">Mudas de mangal plantadas</span>
                </div>
                <div className="doacao-estat-item">
                  <span className="doacao-estat-numero">117 t</span>
                  <span className="doacao-estat-desc">Resíduos removidos</span>
                </div>
                <div className="doacao-estat-item">
                  <span className="doacao-estat-numero">+1.350</span>
                  <span className="doacao-estat-desc">Pessoas beneficiadas</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
};

export default Doacao;