// src/components/Sidebar.tsx
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, MessageSquare,
  Newspaper, Images, BookOpen, LogOut, Bell, Layers
} from 'lucide-react';
import '../style/Sidebar.css';

// ── Lê o utilizador guardado no localStorage ──
const obterUtilizador = () => {
  try {
    const dados = localStorage.getItem('utilizador');
    return dados ? JSON.parse(dados) : null;
  } catch {
    return null;
  }
};

// ── Menus por papel ──────────────────────────────────────────

const menuAdmin = [
  {
    titulo: null,
    itens: [
      { to: '/dashboard/admin',     icone: <LayoutDashboard size={18} />, label: 'Dashboard'   },
      { to: '/dashboard/membros',   icone: <Users size={18} />,           label: 'Membros'      },
      { to: '/dashboard/mensagens', icone: <MessageSquare size={18} />,   label: 'Mensagens'    },
      { to: '/dashboard/projetos',   icone: <Layers size={18} />,           label: 'Projetos' },
    ],
  },
  {
    titulo: 'Comunicação',
    itens: [
      //{ to: '/dashboard/email-doadores', icone: <Mail size={18} />, label: 'E-mail para Doadores' },
     // { to: '/dashboard/email-membros',  icone: <Mail size={18} />, label: 'E-mail para Membros'  },
      { to: '/dashboard/informativos', icone: <Bell size={18} />, label: 'Boletim Informativo' },
    ],
  },
];

const menuEditor = [
  {
    titulo: null,
    itens: [
      { to: '/dashboard/editor',          icone: <LayoutDashboard size={18} />, label: 'Painel Editor'  },
      { to: '/dashboard/editor/noticias', icone: <Newspaper size={18} />,       label: 'Notícias'       },
      { to: '/dashboard/editor/galeria',  icone: <Images size={18} />,          label: 'Galeria'        },
      { to: '/dashboard/editor/blog',     icone: <BookOpen size={18} />,        label: 'Blog & Artigos' },
    ],
  },
];

// ── Componente ───────────────────────────────────────────────
const Sidebar = () => {
  const utilizador = obterUtilizador();
  const papel      = utilizador?.papel ?? 'editor';
  const menu       = papel === 'admin' ? menuAdmin : menuEditor;
  const navegar    = useNavigate();

  const handleSair = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('utilizador');
    navegar('/login');
  };

  return (
    <div className="sidebar">

      {/* Cabeçalho */}
      <div className="sidebar-header">
        <h2>
          <span>●</span>
          {papel === 'admin' ? 'Admin Panel' : 'Editor Panel'}
        </h2>
        <p>{papel === 'admin' ? 'Painel Administrativo' : 'Gestão de Conteúdo'}</p>
      </div>

      {/* Menu dinâmico */}
      <nav className="sidebar-nav">
        <ul>
          {menu.map((grupo, gi) => (
            <div key={`grupo-${gi}`}>
              {/* Título de secção */}
              {grupo.titulo && (
                <li>
                  <div className="section-title">{grupo.titulo}</div>
                </li>
              )}
              {/* Itens */}
              {grupo.itens.map((item, ii) => (
                <li key={`${gi}-${ii}`}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      isActive ? 'sidebar-link active' : 'sidebar-link'
                    }
                  >
                    {item.icone}
                    <span className="nav-text">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </div>
          ))}
        </ul>
      </nav>

      {/* Rodapé */}
      <div className="sidebar-footer">
        <a href="#sair" className="logout" onClick={handleSair} style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%' }}>
          <LogOut size={16} /> <span className="nav-text">Sair do Sistema</span>
        </a>
      </div>

    </div>
  );
};

export default Sidebar;