import { Link } from 'react-router-dom';
import { Instagram, Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="store-footer bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Navegação</h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Loja</Link>
              </li>
              <li>
                <Link to="/sobre" className="hover:text-white transition-colors">Sobre</Link>
              </li>
              <li>
                <Link to="/termos" className="hover:text-white transition-colors">Termos de uso</Link>
              </li>
              <li>
                <Link to="/privacidade" className="hover:text-white transition-colors">Política de Privacidade</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">Perguntas frequentes</Link>
              </li>
              <li>
                <Link to="/trocas" className="hover:text-white transition-colors">Trocas e Devoluções</Link>
              </li>
            </ul>
          </div>

          {/* Certifications & Payment */}
          <div className="space-y-8">
            <div>
              <h3 className="font-semibold mb-4 text-white">Selos e certificações</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-neutral-800 rounded flex items-center justify-center">
                  <span className="text-xs text-neutral-400">SSL</span>
                </div>
                <div className="w-12 h-12 bg-neutral-800 rounded flex items-center justify-center">
                  <span className="text-xs text-neutral-400">Safe</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Formas de Pagamento</h3>
              <div className="flex flex-wrap gap-2">
                {['Visa', 'Master', 'Elo', 'Amex', 'Pix'].map((card) => (
                  <div key={card} className="px-3 py-1 bg-neutral-800 rounded text-xs text-neutral-400">
                    {card}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Redes Sociais</h3>
              <div className="flex items-center gap-3">
                <a 
                  href="https://instagram.com/nacaoraizbrasil" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-neutral-800 rounded-full hover:bg-white hover:text-black transition-colors text-white"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href="https://www.nacaoraiz.com.br" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-neutral-800 rounded-full hover:bg-white hover:text-black transition-colors text-white"
                >
                  <Globe className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="md:text-right">
            <h3 className="font-bold text-lg mb-4 text-white">NAÇÃO RAIZ</h3>
            <div className="text-sm text-neutral-400 space-y-1">
              <p>
                <a href="mailto:nacaoraizbrasil@gmail.com" className="hover:text-white">
                  nacaoraizbrasil@gmail.com
                </a>
              </p>
              <p>Rua Euclides Miragaia, 660</p>
              <p>São José dos Campos, SP</p>
              <p>CEP 12245-820</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-neutral-800 text-center text-sm text-neutral-400">
          <p>© 2026 NAÇÃO RAIZ | 63.195.375/0001-74</p>
        </div>
      </div>
    </footer>
  );
}
