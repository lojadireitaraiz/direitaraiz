import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, User, ChevronDown, CreditCard, Package } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { CartDrawer } from './CartDrawer';
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
  { name: 'Nação Raiz', href: '/colecao/nacao-raiz' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { setOpen: setCartOpen } = useCartStore();
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <>
      <header className="sticky top-0 z-50 bg-background">
        {/* Benefits Bar */}
        <div className="benefits-bar">
          <span>
            <CreditCard className="w-4 h-4" />
            Parcele em até 3x sem juros
          </span>
          <span className="hidden md:flex">
            <Package className="w-4 h-4" />
            Primeira troca sem custo
          </span>
        </div>

        {/* Main Navbar */}
        <nav className="navbar">
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
                <DropdownMenuContent className="bg-background border-border">
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
                <DropdownMenuContent className="bg-background border-border">
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
              <span className="text-2xl font-bold tracking-tight">NAÇÃO RAIZ</span>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button 
                className="p-2 hover:bg-secondary rounded-full transition-colors"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Pesquisar"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link to="/conta" className="hidden md:block p-2 hover:bg-secondary rounded-full transition-colors">
                <User className="w-5 h-5" />
              </Link>

              <button 
                className="p-2 hover:bg-secondary rounded-full transition-colors relative"
                onClick={() => setCartOpen(true)}
                aria-label="Carrinho"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
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
                className="w-full px-4 py-3 bg-secondary border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
            </div>
          )}
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-background border-b border-border animate-slide-in">
            <div className="px-4 py-6 space-y-4">
              <Link to="/" className="block text-base font-medium" onClick={() => setMobileMenuOpen(false)}>
                Loja
              </Link>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Produtos</p>
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
                <p className="text-sm text-muted-foreground">Categorias</p>
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
              <div className="pt-4 border-t border-border space-y-3">
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
