import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { NotFound } from './routes/notFound/notFound'
import { Home } from './routes/home/home'
import { Menu } from './components/component-menu/menu'
import { Equipe } from './routes/equipe/equipe'
import { Contato } from './routes/contato/contato'
import { Footer } from './components/component-footer/footer'
import { Sobre } from './routes/sobre/sobre'

function App() {

    return (
        <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/equipe" element={<Equipe />} />
                    <Route path="/contato" element={<Contato />} />
                    <Route path="/sobre" element={<Sobre />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer />
        </BrowserRouter>
    )
}

export default App
