import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, User, ChevronDown, CreditCard, Package, Truck, MapPin } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { CartDrawer } from './CartDrawer';
import { Logo } from './Logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

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
  const [cepDialogOpen, setCepDialogOpen] = useState(false);
  const [cepInput, setCepInput] = useState('');
  const [savedCity, setSavedCity] = useState<string | null>(() => {
    return localStorage.getItem('headerCity');
  });
  const { setOpen: setCartOpen } = useCartStore();
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBenefitIndex((prev) => (prev + 1) % benefitsMessages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCepSubmit = async () => {
    if (cepInput.length !== 8) {
      toast.error('CEP inválido');
      return;
    }
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepInput}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        toast.error('CEP não encontrado');
        return;
      }
      
      const cityName = data.localidade;
      setSavedCity(cityName);
      localStorage.setItem('headerCity', cityName);
      localStorage.setItem('headerCep', cepInput);
      setCepDialogOpen(false);
      setCepInput('');
      toast.success('Localização salva!');
    } catch {
      toast.error('Erro ao buscar CEP');
    }
  };

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

              {/* CEP Selector */}
              <button 
                onClick={() => setCepDialogOpen(true)}
                className="flex items-center gap-1.5 text-sm font-medium hover:text-muted-foreground transition-colors"
              >
                <MapPin className="w-4 h-4" />
                {savedCity ? (
                  <span className="flex flex-col items-start leading-tight">
                    <span className="text-[10px] text-neutral-400">Enviar para</span>
                    <span className="truncate max-w-[120px]">{savedCity} ...</span>
                  </span>
                ) : (
                  <span className="flex flex-col items-start leading-tight">
                    <span className="text-[10px] text-neutral-400">Informe seu</span>
                    <span>CEP</span>
                  </span>
                )}
              </button>
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
      
      {/* CEP Dialog */}
      <Dialog open={cepDialogOpen} onOpenChange={setCepDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Selecione onde quer receber suas compras</DialogTitle>
          </DialogHeader>
          
          <p className="text-gray-500 text-sm">
            Você poderá ver custos e prazos de entrega precisos em tudo que procurar.
          </p>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">CEP</label>
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Informar um CEP"
                  value={cepInput}
                  onChange={(e) => setCepInput(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  onKeyDown={(e) => e.key === 'Enter' && handleCepSubmit()}
                  className="pr-20"
                />
                <Button 
                  onClick={handleCepSubmit}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Usar
                </Button>
              </div>
              <a 
                href="https://buscacepinter.correios.com.br/app/endereco/index.php" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm whitespace-nowrap"
              >
                Não sei o meu CEP
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CartDrawer />
    </>
  );
}
