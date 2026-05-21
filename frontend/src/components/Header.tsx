import '../style/Header.css';
import logo from '../assets/img/logo.png';
import { Link } from 'react-router-dom';
import { useState } from 'react';   // ← Adicionado

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);   // ← Estado para controlar o menu

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="header">
            <div className="header-container">
                
                {/* Logo */}
                <div className="logo">
                    <img src={logo} alt="Logo ACTAG-MZ" />
                </div>

                {/* Botão Hambúrguer (aparece só no mobile) */}
                <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <div className='right-side'>
                    <nav className="nav">
                        <ul className={isMenuOpen ? 'active' : ''}>
                            <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Inicio</Link></li>
                            <li><Link to="/sobre" onClick={() => setIsMenuOpen(false)}>Quem somos</Link></li>
                            <li><Link to="/noticias" onClick={() => setIsMenuOpen(false)}>Noticias</Link></li>
                            <li><Link to="/galeria" onClick={() => setIsMenuOpen(false)}>Galeria</Link></li>
                            <li><Link to="/projetos" onClick={() => setIsMenuOpen(false)}>Projetos</Link></li>
                            <li><Link to="/impacto" onClick={() => setIsMenuOpen(false)}>Impacto</Link></li>
                            <li><Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contato</Link></li>
                        </ul>
                    </nav>
                    <Link to="/doacao" className="btn">
                        Doar agora
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;