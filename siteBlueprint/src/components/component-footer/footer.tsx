import { Link } from 'react-router-dom';
import './footer.css'

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


const Footer = () => {
    return (
        <footer className="footer">

            <div className="menu">
                <nav>
                    <ul>
                        <li><Link onClick={scrollToTop} to="/">Home</Link></li>
                        <li><Link onClick={scrollToTop} to="/equipe">Equipe</Link></li>
                        <li><Link onClick={scrollToTop} to="/contato">Contato</Link></li>
                    </ul>
                </nav>
            </div>

            <div className="info">
                <div className="info-content">
                    <Link onClick={scrollToTop} to="/" className="info-logo">
                        <h2>Blueprint</h2>
                    </Link>
                    <p>
                        SleepAir: Solução em sono utilizando IA para diagnóstico e bem-estar
                    </p>
                </div>
                <div className="info-content">
                    <h2>Redes Sociais</h2>
                    <div className="redes">
                        <Link target='_blank' to="#"><i className="fa-brands fa-instagram"></i></Link>
                        <Link target='_blank' to="#"><i className="fa-regular fa-envelope"></i></Link>
                        <Link target='_blank' to="#"><i className="fa-brands fa-facebook-f"></i></Link>
                    </div>
                </div>
                <div className="info-content">
                    <h2>Contato</h2>
                    <p>Universidade Federal do Pará – Belém – PA, Rua Augusto Corrêa, 01, Guamá, 66075-110</p>
                </div>
            </div>

            <div className="mapa">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.497927676578!2d-48.45442772562211!3d-1.4740920358589678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x92a48d9630794ccf%3A0xc0dfc65aa0aa15dc!2sGERCOM%20FCT!5e0!3m2!1spt-BR!2sbr!4v1723060124053!5m2!1spt-BR!2sbr" 
                    loading="lazy">
                </iframe>
            </div>

            <div className="dev">
                <h5>Desenvolvido por <Link to="https://www.instagram.com/eduu_rib/" target="_blank">Eduardo Ribeiro <i className="fa-solid fa-code"></i></Link></h5>
                <p>Copyright <i className="fa-regular fa-copyright"></i> Blueprint — Todos os direitos reservados</p>
            </div>

        </footer>
    );
}

export { Footer }