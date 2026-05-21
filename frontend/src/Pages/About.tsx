import '../style/About.css';
import img from '../assets/img/Hero02.jpg';
import location from '../assets/img/localizacao.jpeg'
import { Link } from 'react-router';
import { TrendingUp, Eye, Handshake, Users, TreePine, Recycle, Trees, MapPin, Clock } from 'lucide-react';

const About = () => {
    return (
        <div className="about-page">

            {/* Hero Section */}
            <section className="hero-sobre">
                <h1>Quem somos</h1>
                <p>“Protegendo o mangal, restaurando dunas e fortalecendo comunidades costeiras face às mudanças climáticas.”</p>
            </section>

            {/* Seção ACTAG-MZ */}
            <section className="actagmz">
                <div className="actagmz-container">
                    
                    {/* Coluna da Esquerda - Texto */}
                    <div className="actagmz-card1">
                        <h1>A Associação <u>Tagumanicanave</u> (ACTAG-MZ)</h1>
                        
                        <p>
                            É uma organização comunitária sem fins lucrativos, fundada em 9 de Abril de 2009 
                            na cidade da Beira, Moçambique.
                        </p>
                        
                        <p>
                            Legalmente registada em 2021, a ACTAG-MZ dedica-se à <strong>proteção e restauração costeira</strong>, 
                            à <strong>adaptação às mudanças climáticas</strong> e ao <strong>desenvolvimento comunitário sustentável</strong>.
                        </p>

                        <div className="border">
                            <p className="destaque">
                                O nome “Tagumanicanave” significa <strong>“Reencontro”</strong>, 
                                simbolizando a nossa união para cuidar da nossa casa comum.
                            </p>
                        </div>
                    </div>

                    {/* Coluna da Direita - Imagem + Badge */}
                    <div className="actagmz-card">
                        <div className="image-wrapper">
                            <img src={img} alt="Criança na praia - ACTAG-MZ" />
                            
                            {/* Badge 15+ sobreposto na imagem */}
                            <div className="anos">
                                <h1>15+</h1>
                                <p>Anos de História</p>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* Seção Missão, Visão e Valores */}
            <section className="mission">
                <h1>Missão, Visão e Valores</h1>
                <div className="mission-container">
                
                    <div className="card1">
                        <div className="icon-box1">
                            <TrendingUp size={48} strokeWidth={1.8} />
                        </div>
                        <h3>Nossa Missão</h3>
                        <p>Proteger e restaurar os ecossistemas costeiros através do reflorestamento de mangais e dunas, promover a adaptação às mudanças climáticas e capacitar as comunidades na gestão de riscos e resíduos sólidos costeiros.</p>
                    </div>

                    <div className='card1'>
                        <div className='icon-box2'>
                            <Eye size={48} strokeWidth={1.8} />
                        </div>
                        <h3>Nossa Visão</h3>
                        <p>Ser uma referência nacional em conservação costeira e desenvolvimento comunitário resiliente ao clima em Moçambique.</p>
                    </div>

                    <div className='card1'>
                        <div className='icon-box3'>
                            <Handshake size={48} strokeWidth={1.8} />
                        </div>
                        <h3>Nossos Valores</h3>
                        <ul>
                            <li>Inclusão e equidade de género</li>
                            <li>Sustentabilidade ambiental</li>
                            <li>Solidariedade comunitária</li>
                            <li>Transparência e boa governação</li>
                            <li>Humanismo e respeito pela natureza</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Seção Nossa História */}
            <section className="historia-container">
                <div className="historia">

                    <div className="historia-top">
                        <h1 className="h1H">Nossa História</h1>
                        
                        <div className="citacao">
                            <p className="pH">
                                “A ACTAG-MZ nasceu como uma organização de base comunitária em 2009. 
                                Inicialmente focada em saúde, educação e cultura, 
                                evoluímos para enfrentar os desafios climáticos urgentes da nossa região.”
                            </p>
                        </div>
                    </div>

                    <div className="text">
                        <p>
                            Inicialmente focada em saúde, educação, cultura e proteção social, 
                            a ACTAG ampliou gradualmente o seu âmbito para incluir fortes componentes 
                            ambientais, especialmente a partir de 2024, com a implementação do projeto 
                            Resiliência aos Resíduos Costeiros em Moçambique (RRCM) em parceria com a AMOR.
                        </p>
                        
                        <p>
                            Hoje, a associação atua principalmente na cidade da Beira e zonas costeiras 
                            adjacentes, com ênfase na recuperação de mangais, remoção de resíduos sólidos 
                            e capacitação comunitária.
                        </p>
                    </div>

                </div>
            </section>

            {/* Seção Equipa de Direção */}
            <section className='equipa'>
                <h1>Equipa de Direção</h1>
                <p>Conheça os profissionais dedicados que lideram os nossos esforços de conservação e desenvolvimento.</p>
                
                <div className='equipa-container'>

                    <div className='person-card'>
                        <div className="avatar">
                                {img ? (
                                    <img src={img} alt="Amone Chano" />
                                ) : (
                                    <div className="avatar-iniciais">
                                        AC
                                    </div>
                                )}
                        </div>
                        <h4>Amone Chano</h4>
                        <p>Presidente do Conselho de Direção</p>
                    </div>

                    <div className='person-card'>
                        <div className="avatar">
                                {img ? (
                                    <img src={img} alt="Mario Tomo" />
                                ) : (
                                    <div className="avatar-iniciais">
                                        MT
                                    </div>
                                )}
                        </div>
                        <h4>Mario Tomo</h4>
                        <p>Diretor Executivo</p>
                    </div>

                    <div className='person-card'>
                        <div className="avatar">
                                {img ? (
                                    <img src={img} alt="Lucia" />
                                ) : (
                                    <div className="avatar-iniciais">
                                        LI
                                    </div>
                                )}
                        </div>
                        <h4>Lucia Isaias</h4>
                        <p>Gestora de Programas</p>
                    </div>

                    <div className='person-card'>
                        <div className="avatar">
                                {img ? (
                                    <img src={img} alt="Alberto" />
                                ) : (
                                    <div className="avatar-iniciais">
                                        AF
                                    </div>
                                )}
                        </div>
                        <h4>Alberto Francisco</h4>
                        <p>Director de Estudos e Planificação</p>
                    </div>

                    <div className='person-card'>
                        <div className="avatar">
                                {img ? (
                                    <img src={img} alt="Daniel Fandique" />
                                ) : (
                                    <div className="avatar-iniciais">
                                        DF
                                    </div>
                                )}
                        </div>
                        <h4>Daniel Fandique</h4>
                        <p>Director de Parcerias e Desenvolvimento Comunitário</p>
                    </div>

                    <div className='person-card'>
                        <div className="avatar">
                                {img ? (
                                    <img src={img} alt="Eugenia" />
                                ) : (
                                    <div className="avatar-iniciais">
                                        EI
                                    </div>
                                )}
                        </div>
                        <h4>Eugenia Inacio</h4>
                        <p>Oficial de Administração e Finanças</p>
                    </div>

                    <div className='person-card'>
                        <div className="avatar">
                                {img ? (
                                    <img src={img} alt="Faira" />
                                ) : (
                                    <div className="avatar-iniciais">
                                        FI
                                    </div>
                                )}
                        </div>
                        <h4>Faira Ibraimo</h4>
                        <p>Oficial de Campo</p>
                    </div>
                </div>
            </section>

            {/* Seção de Impacto */}
            <section className='impacto-container'>
                <h1>Números de Impacto</h1>
                <span className='paragrafo-impacto'>Resultados tangíveis das nossas ações nas comunidades costeiras da Beira entre 2024 e 2025.</span>
                <div className='impacto-box'>
                    <div className='impacto'>
                        <div className='icon'>
                            <Users/>
                        </div>
                        
                        <span className="impacto-numero">+1350</span>
                        <p>Pessoas beneficiadas diretamente</p>
                    </div>

                    <div className='impacto'>
                        <div className='icon'>
                            <Recycle/>
                        </div>
                        
                        <span className="impacto-numero">117.733 t</span>
                        <p>Resíduos removidos (2024-2025)</p>
                    </div>

                    <div className='impacto'>
                        <div className='icon'>
                            <Trees/>
                        </div>
                        
                        <span className="impacto-numero">3.000</span>
                        <p>Mudas de mangal plantadas</p>
                    </div>

                    <div className='impacto'>
                        <div className='icon'>
                            <TreePine/>
                        </div>
                        <span className="impacto-numero">+1.142</span>
                        <p>Acácias plantadas na Beira</p>
                    </div>

                </div>
            </section>

    <section className="location-container">
      <div className="location-box">

        {/* Lado esquerdo — informações */}
        <div className="location-left">
          <h2 className="location-title">Onde Atuamos</h2>

          <div className="info-box">
            <span className="icon-box">
              <MapPin size={22} />
            </span>
            <div className="info-text">
              <span className="info-title">Localização Principal</span>
              <span className="info-subtitle">
                Bairro de Inhamizua, Antiga N6, frente à Beira Empreitada.
                Cidade da Beira, Província de Sofala, Moçambique.
              </span>
            </div>
          </div>

          <div className="info-box">
            <span className="icon-box">
              <Clock size={22} />
            </span>
            <div className="info-text">
              <span className="info-title">Horário de Atendimento</span>
              <span className="info-subtitle">Segunda a Sexta: 08h00 às 16h00</span>
            </div>
          </div>

          <Link to="/contact" className="btn-falar">Falar Connosco</Link>
        </div>

        {/* Lado direito — mapa placeholder */}
        <div className="location-right">
          <img src={location} alt="" />
        </div>

      </div>
    </section>


        </div>
    );
};

export default About;