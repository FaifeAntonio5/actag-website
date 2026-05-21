import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Layout          from './components/Layout';
import DashboardLayout from './components/DashboardLayout';
import RotaProtegida   from './components/RotaProtegida';

// Páginas do site
import Home           from './Pages/Home';
import About          from './Pages/About';
import Contact        from './Pages/Contact';
import News           from './Pages/News';
import NewsDatails    from './Pages/NewsDatails';
import Projetos       from './Pages/projetos';
import Doacao         from './Pages/Doacao';
import Impacto        from './Pages/Impacto';
import Galeria        from './Pages/Galeria';

// Auth
import Login          from './Pages/login/Login';

// Dashboard Admin
import DashboardAdmin from './dashboard/DashboardAdmin';
import Mensagens      from './dashboard/Mensagem';
import Informativos   from './dashboard/Informativo';
import Membros        from './dashboard/Membros';
import ProjetosDashboard       from './dashboard/Projetos';

// Dashboard Editor
import DashboardEditor from './dashboard/DashboardEditor';
import NoticiasDashboard  from './dashboard/NoticiasDashboard';
import GaleriaDashboard  from './dashboard/GaleriaDashboard';
import BlogDashboard from './dashboard/BlogDashboard';

function App() {
  return (
    <Router>
      <Routes>

        {/* ── Rotas do site (com Header + Footer) ── */}
        <Route path="/" element={<Layout />}>
          <Route index            element={<Home />}         />
          <Route path="sobre"     element={<About />}        />
          <Route path="contact"   element={<Contact />}      />
          <Route path="noticias"      element={<News />}     />
          <Route path="projetos"      element={<Projetos />}  />
          <Route path="noticias/:id" element={<NewsDatails />} />
          <Route path="doacao"    element={<Doacao />}       />
          <Route path="impacto"   element={<Impacto />}      />
          <Route path="galeria"   element={<Galeria />}      />
        </Route>

        {/* ── Login ── */}
        <Route path="/login" element={<Login />} />

        {/* ── Dashboard (com Sidebar, SEM Header e Footer) ── */}
        <Route path="/dashboard" element={
          <RotaProtegida papel="qualquer">
            <DashboardLayout />
          </RotaProtegida>
        }>
          {/* Rotas do Admin */}
          <Route path="admin" element={
            <RotaProtegida papel="admin">
              <DashboardAdmin />
            </RotaProtegida>
          }/>
          <Route path="membros" element={
            <RotaProtegida papel="admin">
              <Membros />
            </RotaProtegida>
          }/>
          <Route path="mensagens" element={
            <RotaProtegida papel="admin">
              <Mensagens />
            </RotaProtegida>
          }/>
          <Route path="informativos" element={
            <RotaProtegida papel="admin">
              <Informativos />
            </RotaProtegida>
          }/>
          <Route path="projetos" element={
            <RotaProtegida papel="admin">
              <ProjetosDashboard />
            </RotaProtegida>
          }/>

          {/* Rotas do Editor */}
          <Route path="editor" element={
            <RotaProtegida papel="editor">
              <DashboardEditor />
            </RotaProtegida>
          }/>

          <Route path="editor/noticias" element={
            <RotaProtegida papel="editor">
              <NoticiasDashboard />
            </RotaProtegida>
          }/>
          <Route path="editor/galeria" element={
            <RotaProtegida papel="editor">
              <GaleriaDashboard />
            </RotaProtegida>
          }/>
          <Route path="editor/blog" element={
            <RotaProtegida papel="editor">
              <BlogDashboard />
            </RotaProtegida>
          }/>

          {/* Redirecção raiz do dashboard */}
          <Route index element={<Navigate to="/login" replace />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;