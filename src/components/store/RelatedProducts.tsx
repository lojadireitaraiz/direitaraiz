import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { ShopifyProduct, fetchProducts } from '@/lib/shopify';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/button';

interface RelatedProductsProps {
  title?: string;
  query?: string;
  excludeHandle?: string;
}

export function RelatedProducts({ title, query, excludeHandle }: RelatedProductsProps) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const productsPerPage = 4;

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const data = await fetchProducts(50, query);
      setProducts(data);
      setLoading(false);
    }
    loadProducts();
  }, [query]);

  const filteredProducts = excludeHandle 
    ? products.filter(p => p.node.handle !== excludeHandle)
    : products;

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const canGoNext = currentIndex < totalPages - 1;
  const canGoPrev = currentIndex > 0;

  const visibleProducts = filteredProducts.slice(
    currentIndex * productsPerPage,
    (currentIndex + 1) * productsPerPage
  );

  const handleNext = () => {
    if (canGoNext) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (canGoPrev) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {title && <h2 className="text-xl font-semibold">{title}</h2>}
        
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              disabled={!canGoPrev}
              className="h-9 w-9 rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={!canGoNext}
              className="h-9 w-9 rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {visibleProducts.map((product) => (
          <ProductCard key={product.node.id} product={product} />
        ))}
      </div>
    </section>
  );
}
