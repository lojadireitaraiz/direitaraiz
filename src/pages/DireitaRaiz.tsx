import { useEffect, useState, useMemo } from 'react';
import { Header } from '@/components/store/Header';
import { Footer } from '@/components/store/Footer';
import { ProductCard } from '@/components/store/ProductCard';
import { ShopifyProduct, fetchProducts } from '@/lib/shopify';
import { 
  ChevronDown, 
  Grid2X2, 
  Grid3X3, 
  Loader2, 
  SlidersHorizontal,
  X 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const sortOptions = [
  { label: 'Mais vendidas', value: 'sales' },
  { label: 'Menor preço', value: 'lowest_price' },
  { label: 'Maior preço', value: 'biggest_price' },
  { label: 'Novidades', value: 'recent' },
];

export default function DireitaRaiz() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridCols, setGridCols] = useState(4);
  const [sortBy, setSortBy] = useState('sales');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      // Fetch all products and filter out those with infantil tags
      const allProducts = await fetchProducts(100);
      const filteredProducts = allProducts.filter((product: ShopifyProduct) => {
        const tags = product.node.tags?.map((tag: string) => tag.toUpperCase()) || [];
        return !tags.includes('CAMISETA INFANTIL') && !tags.includes('BODY INFANTIL');
      });
      setProducts(filteredProducts);
      setLoading(false);
    }
    loadProducts();
  }, []);

  // Extract all available sizes from products (excluding month variants)
  const availableSizes = useMemo(() => {
    const sizes = new Set<string>();
    // Matches patterns like 0-3M, 3-6M, 6-9M, 9-12M, 12-18M, 18-24M, or any size containing "M" with numbers
    const monthPattern = /^\d+(-\d+)?M$/i;
    products.forEach(product => {
      product.node.options.forEach(option => {
        if (option.name.toLowerCase() === 'tamanho' || option.name.toLowerCase() === 'size') {
          option.values.forEach(value => {
            // Exclude month-based sizes (contains numbers followed by M)
            if (!monthPattern.test(value) && !/\d+\s*M(ESES)?/i.test(value)) {
              sizes.add(value);
            }
          });
        }
      });
    });
    return Array.from(sizes).sort((a, b) => {
      const order = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG', 'XXXG'];
      const indexA = order.indexOf(a);
      const indexB = order.indexOf(b);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      return a.localeCompare(b);
    });
  }, [products]);

  // Get price range from products
  const productPriceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 500 };
    const prices = products.map(p => parseFloat(p.node.priceRange.minVariantPrice.amount));
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices))
    };
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const price = parseFloat(product.node.priceRange.minVariantPrice.amount);
      if (price < priceRange[0] || price > priceRange[1]) return false;

      if (selectedSizes.length > 0) {
        const productSizes = product.node.options
          .filter(opt => opt.name.toLowerCase() === 'tamanho' || opt.name.toLowerCase() === 'size')
          .flatMap(opt => opt.values);
        if (!selectedSizes.some(size => productSizes.includes(size))) return false;
      }

      return true;
    });

    // Sort - "Uma merda" always first
    filtered.sort((a, b) => {
      const aIsUmaMerda = a.node.title.toLowerCase().includes('uma merda');
      const bIsUmaMerda = b.node.title.toLowerCase().includes('uma merda');
      
      if (aIsUmaMerda && !bIsUmaMerda) return -1;
      if (!aIsUmaMerda && bIsUmaMerda) return 1;
      
      switch (sortBy) {
        case 'lowest_price':
          return parseFloat(a.node.priceRange.minVariantPrice.amount) - parseFloat(b.node.priceRange.minVariantPrice.amount);
        case 'biggest_price':
          return parseFloat(b.node.priceRange.minVariantPrice.amount) - parseFloat(a.node.priceRange.minVariantPrice.amount);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, priceRange, selectedSizes, sortBy]);

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const clearFilters = () => {
    setPriceRange([productPriceRange.min, productPriceRange.max]);
    setSelectedSizes([]);
  };

  const activeFiltersCount = selectedSizes.length + (priceRange[0] > productPriceRange.min || priceRange[1] < productPriceRange.max ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-4 text-foreground">Preço</h3>
        <Slider
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          min={productPriceRange.min}
          max={productPriceRange.max}
          step={10}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>R$ {priceRange[0]}</span>
          <span>R$ {priceRange[1]}</span>
        </div>
      </div>

      {/* Sizes */}
      {availableSizes.length > 0 && (
        <div>
          <h3 className="font-semibold mb-4 text-foreground">Tamanho</h3>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map(size => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${
                  selectedSizes.includes(size)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border hover:border-primary'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          Limpar filtros
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-3xl font-bold text-foreground mb-1 md:mb-2">Direita Raiz</h1>
          <p className="text-xs md:text-base text-muted-foreground">
            {loading ? 'Carregando...' : `${filteredProducts.length} produtos encontrados`}
          </p>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-24 bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg text-foreground">Filtros</h2>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary">{activeFiltersCount}</Badge>
                )}
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4" />
                      Filtros
                      {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="ml-1">{activeFiltersCount}</Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filtros</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-secondary transition-colors">
                    Ordenar por
                    <ChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-background border-border">
                    {sortOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={sortBy === option.value ? 'bg-primary text-primary-foreground' : ''}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Grid Toggle */}
              <div className="hidden md:flex items-center gap-1">
                <button
                  onClick={() => setGridCols(2)}
                  className={`p-2 rounded ${gridCols === 2 ? 'text-primary' : 'text-muted-foreground'}`}
                  aria-label="2 colunas"
                >
                  <Grid2X2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setGridCols(4)}
                  className={`p-2 rounded ${gridCols === 4 ? 'text-primary' : 'text-muted-foreground'}`}
                  aria-label="4 colunas"
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Active Filters Tags */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedSizes.map(size => (
                  <Badge 
                    key={size} 
                    variant="secondary" 
                    className="flex items-center gap-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => toggleSize(size)}
                  >
                    Tamanho: {size}
                    <X className="w-3 h-3" />
                  </Badge>
                ))}
                {(priceRange[0] > productPriceRange.min || priceRange[1] < productPriceRange.max) && (
                  <Badge 
                    variant="secondary" 
                    className="flex items-center gap-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => setPriceRange([productPriceRange.min, productPriceRange.max])}
                  >
                    R$ {priceRange[0]} - R$ {priceRange[1]}
                    <X className="w-3 h-3" />
                  </Badge>
                )}
              </div>
            )}

            {/* Products Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-xl text-muted-foreground mb-4">Nenhum produto encontrado</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Tente ajustar os filtros para ver mais resultados.
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Limpar filtros
                </Button>
              </div>
            ) : (
              <div 
                className={`grid gap-4 md:gap-6 ${
                  gridCols === 2 
                    ? 'grid-cols-2' 
                    : 'grid-cols-2 lg:grid-cols-4'
                }`}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.node.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
