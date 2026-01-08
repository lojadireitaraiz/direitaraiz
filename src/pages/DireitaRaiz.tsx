import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/store/Header';
import { Footer } from '@/components/store/Footer';
import { ProductCard } from '@/components/store/ProductCard';
import { fetchProducts, ShopifyProduct } from '@/lib/shopify';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

export default function DireitaRaiz() {
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['direitaRaizProducts'],
    queryFn: async () => {
      // Fetch all products and filter out those with infantil tags
      const allProducts = await fetchProducts(100);
      return allProducts.filter((product: ShopifyProduct) => {
        const tags = product.node.tags?.map((tag: string) => tag.toUpperCase()) || [];
        return !tags.includes('CAMISETA INFANTIL') && !tags.includes('BODY INFANTIL');
      });
    },
  });

  const allSizes = useMemo(() => {
    if (!products) return [];
    const sizes = new Set<string>();
    products.forEach((product: ShopifyProduct) => {
      product.node.options?.forEach(option => {
        if (option.name.toLowerCase() === 'tamanho' || option.name.toLowerCase() === 'size') {
          option.values.forEach(value => sizes.add(value));
        }
      });
    });
    return Array.from(sizes).sort();
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];
    
    let filtered = products.filter((product: ShopifyProduct) => {
      const price = parseFloat(product.node.priceRange.minVariantPrice.amount);
      if (price < priceRange[0] || price > priceRange[1]) return false;
      
      if (selectedSizes.length > 0) {
        const productSizes = product.node.options
          ?.find(opt => opt.name.toLowerCase() === 'tamanho' || opt.name.toLowerCase() === 'size')
          ?.values || [];
        if (!selectedSizes.some(size => productSizes.includes(size))) return false;
      }
      
      return true;
    });

    return filtered.sort((a: ShopifyProduct, b: ShopifyProduct) => {
      switch (sortBy) {
        case 'price-asc':
          return parseFloat(a.node.priceRange.minVariantPrice.amount) - parseFloat(b.node.priceRange.minVariantPrice.amount);
        case 'price-desc':
          return parseFloat(b.node.priceRange.minVariantPrice.amount) - parseFloat(a.node.priceRange.minVariantPrice.amount);
        case 'name-asc':
          return a.node.title.localeCompare(b.node.title);
        case 'name-desc':
          return b.node.title.localeCompare(a.node.title);
        default:
          return 0;
      }
    });
  }, [products, sortBy, priceRange, selectedSizes]);

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-black text-white py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 uppercase">
              Direita Raiz
            </h1>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Coleção exclusiva para quem tem orgulho de suas convicções
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Filters and Sort */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="flex items-center gap-2 text-sm font-medium border border-neutral-300 px-4 py-2 rounded-md hover:bg-neutral-100 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filtros
                {filtersOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <span className="text-sm text-muted-foreground">
                {filteredAndSortedProducts.length} produtos
              </span>
            </div>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Em destaque</SelectItem>
                <SelectItem value="price-asc">Menor preço</SelectItem>
                <SelectItem value="price-desc">Maior preço</SelectItem>
                <SelectItem value="name-asc">A-Z</SelectItem>
                <SelectItem value="name-desc">Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Collapsible Filters */}
          <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
            <CollapsibleContent className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-neutral-50 rounded-lg">
                {/* Price Range */}
                <div>
                  <h3 className="font-medium mb-4">Faixa de Preço</h3>
                  <Slider
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    max={500}
                    min={0}
                    step={10}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>R$ {priceRange[0]}</span>
                    <span>R$ {priceRange[1]}</span>
                  </div>
                </div>

                {/* Size Filter */}
                {allSizes.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-4">Tamanho</h3>
                    <div className="flex flex-wrap gap-3">
                      {allSizes.map((size) => (
                        <label
                          key={size}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Checkbox
                            checked={selectedSizes.includes(size)}
                            onCheckedChange={() => toggleSize(size)}
                          />
                          <span className="text-sm">{size}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">Erro ao carregar produtos</p>
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum produto encontrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredAndSortedProducts.map((product: ShopifyProduct) => (
                <ProductCard key={product.node.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
