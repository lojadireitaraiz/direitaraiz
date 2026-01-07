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
                {/* SSL Secure */}
                <div className="w-16 h-12 bg-white rounded flex items-center justify-center p-1">
                  <svg viewBox="0 0 48 48" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 4L6 12V22C6 33.1 13.8 43.3 24 46C34.2 43.3 42 33.1 42 22V12L24 4Z" fill="#4CAF50"/>
                    <path d="M20 32L12 24L14.8 21.2L20 26.4L33.2 13.2L36 16L20 32Z" fill="white"/>
                  </svg>
                </div>
                {/* Compra Segura */}
                <div className="w-16 h-12 bg-white rounded flex items-center justify-center p-1">
                  <svg viewBox="0 0 48 48" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="8" y="20" width="32" height="24" rx="2" fill="#1565C0"/>
                    <path d="M16 20V14C16 9.58 19.58 6 24 6C28.42 6 32 9.58 32 14V20" stroke="#1565C0" strokeWidth="4" fill="none"/>
                    <circle cx="24" cy="32" r="3" fill="white"/>
                    <path d="M24 35V38" stroke="white" strokeWidth="2"/>
                  </svg>
                </div>
                {/* Google Safe */}
                <div className="w-16 h-12 bg-white rounded flex items-center justify-center p-1">
                  <svg viewBox="0 0 48 48" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM20 34L10 24L12.82 21.18L20 28.34L35.18 13.16L38 16L20 34Z" fill="#34A853"/>
                  </svg>
                </div>
                {/* Site Blindado */}
                <div className="w-16 h-12 bg-white rounded flex items-center justify-center p-1">
                  <svg viewBox="0 0 48 48" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 2L4 10V22C4 34.56 12.64 46.28 24 50C35.36 46.28 44 34.56 44 22V10L24 2Z" fill="#FFC107"/>
                    <path d="M24 8L10 14V22C10 31.7 16.48 40.74 24 44C31.52 40.74 38 31.7 38 22V14L24 8Z" fill="#FF9800"/>
                    <path d="M24 14L16 18V24C16 29.52 19.52 34.58 24 36C28.48 34.58 32 29.52 32 24V18L24 14Z" fill="#F57C00"/>
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Formas de Pagamento</h3>
              <div className="flex flex-wrap gap-2">
                <img src="https://d2u4gk28rgr5ys.cloudfront.net/assets/icons/cards/visa-4c562b0e312e36ce0daadaf465d3759ca162cb39c6a828454a5cfb2c95f8e26a.svg" alt="Visa" className="w-10 h-6" />
                <img src="https://d2u4gk28rgr5ys.cloudfront.net/assets/icons/cards/master-f27cb6ce5923f7f52ceded3fdc486079492ac922931c00db634211bb5453b11c.svg" alt="Mastercard" className="w-10 h-6" />
                <img src="https://d2u4gk28rgr5ys.cloudfront.net/assets/icons/cards/elo-c40efbc3640e09e5b4acd03ee7f09dd31d521959516adf224f007458739d77e3.svg" alt="Elo" className="w-10 h-6" />
                <img src="https://d2u4gk28rgr5ys.cloudfront.net/assets/icons/cards/amex-6f16117e3c9e8a546737b6951c187f2014009b8b40e374dc0c846561ea66c663.svg" alt="Amex" className="w-10 h-6" />
                <img src="https://d2u4gk28rgr5ys.cloudfront.net/assets/icons/cards/dinners-32c627a8ea96ce8e10b78feafe65bb95ae948af63539dcb9fea45a8c376a419f.svg" alt="Diners" className="w-10 h-6" />
                <img src="https://d2u4gk28rgr5ys.cloudfront.net/assets/icons/cards/pix-39099f2f23f9b0fcc7e66c2759d247b7f04e7bd44b8b8f1103aaa2ee28c0f86d.svg" alt="Pix" className="w-10 h-6" />
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
