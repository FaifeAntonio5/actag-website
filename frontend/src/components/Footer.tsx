import '../style/Footer.css';
import footerLogo from '../assets/img/We-Can-Fly-3.png';
import { useState } from 'react';
import { informativoAPI } from '../lib/api';
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp} from 'react-icons/fa';

const Footer = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [estado, setEstado] = useState<'idle' | 'loading' | 'sucesso' | 'erro'>('idle');
    const [mensagem, setMensagem] = useState('');

    const handleSubscrever = async () => {
        if (!nome.trim()) {
            setEstado('erro');
            setMensagem('Por favor, insira o seu nome.');
            return;
        }
        if (!email || !email.includes('@')) {
            setEstado('erro');
            setMensagem('Por favor, insira um e-mail válido.');
            return;
        }

        setEstado('loading');

        try {
            const resposta = await informativoAPI.subscrever({ nome, email });
            setEstado('sucesso');
            setMensagem(resposta.mensagem);
            setTimeout(() => setMensagem(''), 5000);
            setNome('');
            setEmail('');
        } catch (err: any) {
            setEstado('erro');
            setMensagem(err.message || 'Erro ao subscrever.');
        }
    };

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="description">
                    <div className="logo">
                        <img src={footerLogo} alt="ACTAG-MZ Logo" />
                    </div>
                    <p>Associação comunitária sem fins lucrativos dedicada à proteção costeira e restauração de mangais na Beira, Moçambique.</p>
                    
                    {/* Secção de redes sociais atualizada com ícones reais e acessibilidade */}
                    <div className="social-midia">
                        <a href="#" target="_blank" rel='noopener noreferrer' aria-label="Facebook da ACTAG">
                            <FaFacebookF className="social-icon" />
                        </a>
                        <a href="#" target="_blank" rel='noopener noreferrer' aria-label="Instagram da ACTAG">
                            <FaInstagram className="social-icon" />
                        </a>
                        <a href="#" target="_blank" rel='noopener noreferrer' aria-label="TikTok da ACTAG">
                            <FaTiktok className="social-icon" />
                        </a>
                        <a href="https://wa.me/258871905800" target="_blank" rel='noopener noreferrer' aria-label="WhatsApp da ACTAG">
                            <FaWhatsapp className="social-icon" />
                        </a>
                    </div>
                </div>

                <div className="footer-links">
                    <h3>Links rápidos</h3>
                    <a href="/about">Quem Somos</a>
                    <a href="/contact">Contacto</a>
                    <a href="#">Privacidade</a>
                </div>

                <div className="contact">
                    <h3>Contato</h3>
                    <p>Bairro de Inhamizua, Antiga N6, Beira, Moçambique</p>
                    <p>+258 87 190 5800</p>
                    <p>08h00 às 16h00 (Seg-Sex)</p>
                </div>

                <div className="information">
                    <h3>Boletim Informativo</h3>
                    <p>Receba novidades sobre os nossos projetos.</p>

                    <input
                        type="text"
                        placeholder="O seu nome"
                        value={nome}
                        onChange={e => { setNome(e.target.value); setEstado('idle'); }}
                        disabled={estado === 'loading'}
                    />

                    <input
                        type="email"
                        placeholder="O seu e-mail"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setEstado('idle'); }}
                        disabled={estado === 'loading'}
                    />

                    <button
                        type="button"
                        onClick={handleSubscrever}
                        disabled={estado === 'loading'}
                    >
                        {estado === 'loading' ? 'A PROCESSAR...' : 'INSCREVER-SE'}
                    </button>

                    {mensagem && (
                        <div className={`newsletter-msg-container ${estado}`}>
                            <span className="newsletter-msg">{mensagem}</span>
                        </div>
                    )}
                </div>
            </div>

            <p className="copyright">&copy; 2026 ACTAG-MZ - Associação Tagumanicanave. Todos os direitos reservados.</p>
        </footer>
    );
};

export default Footer;