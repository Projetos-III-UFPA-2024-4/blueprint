import { Link } from 'react-router-dom';
import { Menu } from '../component-menu/menu';
import './style.css'
const HomeComponent = () => {
    return (
        <>
            <section className="homeComponent">
                <Menu />
                <div className="homeComponent-container">
                    <div className="homeComponent-content">
                        <h4>Respire melhor, durma melhor, viva melhor</h4>
                        <p>SleepAir: Solução em sono usando IA para diagnóstico e bem-estar.</p>
                        <Link to='/sobre'>Saiba mais</Link>
                    </div>
                </div>
            </section>
        </>
    );
};

export { HomeComponent };