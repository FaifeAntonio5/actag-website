import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Lock, Mail, Leaf } from 'lucide-react';
import { authAPI } from './../../lib/api';
import './../../style/Login.css';

const Login = () => {
  const [email,       setEmail]       = useState('');
  const [senha,       setSenha]       = useState('');
  const [mostrarSenha,setMostrarSenha]= useState(false);
  const [erro,        setErro]        = useState('');
  const [loading,     setLoading]     = useState(false);
  const navegar = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !senha) {
      setErro('Preencha todos os campos.');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      const resposta = await authAPI.login(email, senha);

      // Guarda token e dados do utilizador
      localStorage.setItem('token',       resposta.token);
      localStorage.setItem('utilizador',  JSON.stringify(resposta.utilizador));

      // Redireciona conforme o papel
      if (resposta.utilizador.papel === 'admin') {
        navegar('/dashboard/admin');
      } else {
        navegar('/dashboard/editor');
      }
    } catch (err: any) {
      setErro(err.message || 'Credenciais inválidas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-pagina">

      {/* Lado esquerdo — decorativo */}
      <div className="login-lado-esquerdo">
        <div className="login-decorativo-conteudo">
          <div className="login-logo">
            <Leaf size={36} />
          </div>
          <h1>Associação Tagumanicanave</h1>
          <p>Protegendo os ecossistemas costeiros de Mocambique para as gerações futuras.</p>
          <div className="login-decorativo-stats">
            <div className="login-stat">
              <span className="login-stat-numero">3.000</span>
              <span className="login-stat-label">Mudas plantadas</span>
            </div>
            <div className="login-stat">
              <span className="login-stat-numero">117t</span>
              <span className="login-stat-label">Resíduos removidos</span>
            </div>
            <div className="login-stat">
              <span className="login-stat-numero">1.350+</span>
              <span className="login-stat-label">Pessoas beneficiadas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lado direito — formulário */}
      <div className="login-lado-direito">
        <div className="login-formulario-caixa">

          <div className="login-formulario-cabecalho">
            <h2>Área Restrita</h2>
            <p>Faça login para aceder ao painel de gestão.</p>
          </div>

          {erro && (
            <div className="login-erro">
              {erro}
            </div>
          )}

          <form onSubmit={handleLogin} className="login-formulario">

            <div className="login-campo">
              <label className="login-label">EMAIL</label>
              <div className="login-input-caixa">
                <Mail size={16} className="login-input-icone" />
                <input
                  type="email"
                  placeholder="email@actag.org"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErro(''); }}
                  className="login-input"
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="login-campo">
              <label className="login-label">SENHA</label>
              <div className="login-input-caixa">
                <Lock size={16} className="login-input-icone" />
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={senha}
                  onChange={e => { setSenha(e.target.value); setErro(''); }}
                  className="login-input"
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-toggle-senha"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  tabIndex={-1}
                >
                  {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="login-botao"
              disabled={loading}
            >
              {loading
                ? <><Loader2 size={16} className="login-spinner" /> A entrar...</>
                : 'Entrar no Sistema'
              }
            </button>

          </form>

          <p className="login-rodape-texto">
            Acesso restrito a membros da equipa ACTAG-MZ.
          </p>

        </div>
      </div>

    </div>
  );
};

export default Login;