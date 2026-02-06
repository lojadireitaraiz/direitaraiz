import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, User, ChevronDown, CreditCard, Package, Truck, MapPin } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { CartDrawer } from './CartDrawer';
import { Logo } from './Logo';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [currentBenefitIndex, setCurrentBenefitIndex] = useState(0);
  const [cepDialogOpen, setCepDialogOpen] = useState(false);
  const [cepInput, setCepInput] = useState('');
  const [showCepNotification, setShowCepNotification] = useState(false);
  const [savedCity, setSavedCity] = useState<string | null>(() => {
    return localStorage.getItem('headerCity');
  });
  const { setOpen: setCartOpen } = useCartStore();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/produtos?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBenefitIndex((prev) => (prev + 1) % benefitsMessages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Show CEP notification on first visit
  useEffect(() => {
    const hasSeenNotification = localStorage.getItem('cepNotificationSeen');
    const hasCepSaved = localStorage.getItem('headerCity');
    
    if (!hasSeenNotification && !hasCepSaved) {
      const timer = setTimeout(() => {
        setShowCepNotification(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissCepNotification = () => {
    setShowCepNotification(false);
    localStorage.setItem('cepNotificationSeen', 'true');
  };

  const handleIncluirCep = () => {
    dismissCepNotification();
    setCepDialogOpen(true);
  };

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
            <div className="hidden lg:flex items-center gap-6 flex-1">
              {/* Search Button - Left */}
              <button 
                className="p-2 hover:bg-neutral-800 rounded-full transition-colors"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Pesquisar"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* CEP Selector with Notification */}
              <div className="relative">
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

                {/* CEP Notification Tooltip */}
                {showCepNotification && (
                  <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-md shadow-lg border border-gray-200 p-2.5 z-50 animate-fade-in">
                    {/* Arrow */}
                    <div className="absolute -top-1.5 left-4 w-3 h-3 bg-white border-l border-t border-gray-200 rotate-45"></div>
                    
                    <h4 className="font-semibold text-gray-900 text-xs mb-0.5">
                      Confira o envio para o seu endereço
                    </h4>
                    <p className="text-[11px] text-gray-500 mb-2">
                      Inclua seu CEP para verificar custos e prazos de entrega.
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleIncluirCep}
                        className="px-2.5 py-1 text-xs font-medium text-white rounded"
                        style={{ backgroundColor: '#50B150' }}
                      >
                        Incluir CEP
                      </button>
                      <button
                        onClick={dismissCepNotification}
                        className="text-xs font-medium"
                        style={{ color: '#50B150' }}
                      >
                        Mais tarde
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <Link to="/" className="text-sm font-medium hover:text-muted-foreground transition-colors">
                Loja
              </Link>
              
              {/* Produtos Dropdown - Hover */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm font-medium hover:text-muted-foreground transition-colors">
                  Produtos
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-black border border-neutral-800 rounded-md py-1 min-w-[180px] shadow-lg">
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        to={category.href}
                        className="block px-4 py-2 text-sm hover:bg-neutral-800 transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Categorias Dropdown - Hover */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm font-medium hover:text-muted-foreground transition-colors">
                  Categorias
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-black border border-neutral-800 rounded-md py-1 min-w-[180px] shadow-lg">
                    {collections.map((collection) => (
                      <Link
                        key={collection.name}
                        to={collection.href}
                        className="block px-4 py-2 text-sm hover:bg-neutral-800 transition-colors"
                      >
                        {collection.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link to="/sobre" className="text-sm font-medium hover:text-muted-foreground transition-colors">
                Sobre
              </Link>
            </div>

            {/* Logo - Center */}
            <Link to="/" className="navbar-brand absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 lg:mx-auto">
              <Logo className="h-10 md:h-12 w-auto" />
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-4 flex-1 justify-end">
              {/* Mobile Search Button */}
              <button 
                className="lg:hidden p-2 hover:bg-neutral-800 rounded-full transition-colors"
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
            <form onSubmit={handleSearch} className="mt-4 max-w-md mx-auto animate-fade-in">
              <input
                type="search"
                placeholder="Pesquisar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-full text-sm text-white focus:outline-none focus:ring-2 focus:ring-white"
                autoFocus
              />
            </form>
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
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-4 text-white"
                  style={{ backgroundColor: '#50B150' }}
                >
                  Usar
                </Button>
              </div>
              <a 
                href="https://buscacepinter.correios.com.br/app/endereco/index.php" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline text-sm whitespace-nowrap"
                style={{ color: '#50B150' }}
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
