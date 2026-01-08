import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, User, ChevronDown, CreditCard, Package, Truck } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { CartDrawer } from './CartDrawer';
import { Logo } from './Logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const categories = [
  { name: 'Camiseta', href: '/produtos?type=camiseta' },
  { name: 'Camiseta Infantil', href: '/produtos?type=infantil' },
  { name: 'Hoodie Moletom', href: '/produtos?type=hoodie' },
  { name: 'Body Infantil', href: '/produtos?type=body' },
];

const collections = [
  { name: 'Nação Kids', href: '/colecao/nacao-kids' },
  { name: 'Direita Raiz', href: '/colecao/direita-raiz' },
];

const benefitsMessages = [
  { icon: CreditCard, text: 'Parcele em até 3x sem juros' },
  { icon: Package, text: 'Primeira troca sem custo' },
  { icon: Truck, text: 'Frete grátis a partir de 2 peças' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentBenefitIndex, setCurrentBenefitIndex] = useState(0);
  const { setOpen: setCartOpen } = useCartStore();
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBenefitIndex((prev) => (prev + 1) % benefitsMessages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = benefitsMessages[currentBenefitIndex].icon;

  return (
    <>
      <header className="bg-black text-white">
        {/* Benefits Bar */}
        <div className="bg-neutral-900 text-white py-2.5 px-4 text-sm flex items-center justify-center overflow-hidden h-10">
          <span 
            key={currentBenefitIndex}
            className="flex items-center gap-2 text-xs md:text-sm font-medium animate-fade-in"
          >
            <CurrentIcon className="w-4 h-4" />
            {benefitsMessages[currentBenefitIndex].text}
          </span>
        </div>

        {/* Main Navbar */}
        <nav className="bg-black border-b border-neutral-800 px-4 md:px-10 py-5 md:py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Desktop Navigation - Left */}
            <div className="hidden lg:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium hover:text-muted-foreground transition-colors">
                Loja
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-muted-foreground transition-colors">
                  Produtos
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-black border-neutral-800 text-white">
                  {categories.map((category) => (
                    <DropdownMenuItem key={category.name} asChild>
                      <Link to={category.href} className="cursor-pointer">
                        {category.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-muted-foreground transition-colors">
                  Categorias
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-black border-neutral-800 text-white">
                  {collections.map((collection) => (
                    <DropdownMenuItem key={collection.name} asChild>
                      <Link to={collection.href} className="cursor-pointer">
                        {collection.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to="/sobre" className="text-sm font-medium hover:text-muted-foreground transition-colors">
                Sobre
              </Link>
            </div>

            {/* Logo - Center */}
            <Link to="/" className="navbar-brand">
              <Logo className="h-10 md:h-12 w-auto" />
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button 
                className="p-2 hover:bg-neutral-800 rounded-full transition-colors"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Pesquisar"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link to="/conta" className="hidden md:block p-2 hover:bg-neutral-800 rounded-full transition-colors">
                <User className="w-5 h-5" />
              </Link>

              <button 
                className="p-2 hover:bg-neutral-800 rounded-full transition-colors relative"
                onClick={() => setCartOpen(true)}
                aria-label="Carrinho"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <div className="mt-4 max-w-md mx-auto animate-fade-in">
              <input
                type="search"
                placeholder="Pesquisar..."
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-full text-sm text-white focus:outline-none focus:ring-2 focus:ring-white"
                autoFocus
              />
            </div>
          )}
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-black border-b border-neutral-800 animate-slide-in">
            <div className="px-4 py-6 space-y-4">
              <Link to="/" className="block text-base font-medium" onClick={() => setMobileMenuOpen(false)}>
                Loja
              </Link>
              <div className="space-y-2">
                <p className="text-sm text-neutral-400">Produtos</p>
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    to={category.href}
                    className="block pl-4 text-base"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-sm text-neutral-400">Categorias</p>
                {collections.map((collection) => (
                  <Link
                    key={collection.name}
                    to={collection.href}
                    className="block pl-4 text-base"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {collection.name}
                  </Link>
                ))}
              </div>
              <Link to="/sobre" className="block text-base font-medium" onClick={() => setMobileMenuOpen(false)}>
                Sobre
              </Link>
              <div className="pt-4 border-t border-neutral-800 space-y-3">
                <Link to="/conta" className="flex items-center gap-3 text-sm" onClick={() => setMobileMenuOpen(false)}>
                  <User className="w-5 h-5" />
                  Entrar
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
      
      <CartDrawer />
    </>
  );
}
