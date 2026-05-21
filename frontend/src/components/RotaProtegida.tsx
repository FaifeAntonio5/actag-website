import { Navigate } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
  papel?: 'admin' | 'editor' | 'qualquer';
};

const RotaProtegida = ({ children, papel = 'qualquer' }: Props) => {
  const token      = localStorage.getItem('token');
  const utilizador = JSON.parse(localStorage.getItem('utilizador') || 'null');

  // Não está logado
  if (!token || !utilizador) {
    return <Navigate to="/login" replace />;
  }

  // Verificação de papel
  if (papel === 'admin' && utilizador.papel !== 'admin') {
    // Não é admin — manda para o dashboard do editor
    return <Navigate to="/dashboard/editor" replace />;
  }

  if (papel === 'editor' && utilizador.papel !== 'editor') {
    // Não é editor — manda para o dashboard do admin
    return <Navigate to="/dashboard/admin" replace />;
  }

  // Tudo certo — deixa passar
  return <>{children}</>;
};

export default RotaProtegida;