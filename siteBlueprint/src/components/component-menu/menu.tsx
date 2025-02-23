import { Link } from 'react-router-dom';
import './menu.css';
import { useState } from 'react'; 
import logo from '../../../src/assets/logo.svg'

const handleLogoClick = () => {
    window.location.href = "/";
};

function Menu() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Estado para alternar o menu
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen); // Alternar o estado do menu
    };

    return (
        <>
            <section className="menu-component">
                <Link to="/" className="logo" onClick={handleLogoClick}>
                    <img src={logo} alt="logo blueprint" />
                    <h1>Blueprint</h1>
                </Link>
                <div className={`menu-conteudo ${isMobileMenuOpen ? 'open' : ''}`}>
                    <nav>
                        <Link to="/">Home</Link>
                        <Link to="/equipe">Equipe</Link>
                        <Link to="/sobre">Sobre</Link>
                        <Link to="/contato">Contato</Link>
                    </nav>
                </div>
                {/* Ícone do menu hambúrguer */}
                <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
                    <i className="fa-solid fa-bars"></i>
                </div>
            </section>
        </>
    );
}

export { Menu };
