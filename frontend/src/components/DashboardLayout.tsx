// src/components/DashboardLayout.tsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../style/DashboardLayout.css';

const DashboardLayout = () => {
  return (
   // A estrutura deve ser assim:
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{
        marginLeft: '280px',
        width: 'calc(100% - 280px)',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;