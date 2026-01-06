import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Loader2, Minus, Plus, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/store/Header';
import { Footer } from '@/components/store/Footer';
import { Button } from '@/components/ui/button';
import { fetchProductByHandle, formatPrice, calculateDiscount, calculateInstallments, ShopifyProduct } from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';

export default function ProductDetail() {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct['node'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  const { addItem, setOpen } = useCartStore();

  useEffect(() => {
    async function loadProduct() {
      if (!handle) return;
      setLoading(true);
      const data = await fetchProductByHandle(handle);
      setProduct(data);
      if (data?.variants.edges[0]) {
        setSelectedVariant(data.variants.edges[0].node.id);
      }
      setLoading(false);
    }
    loadProduct();
  }, [handle]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) {
      toast.error('Selecione uma variante');
      return;
    }

    const variant = product.variants.edges.find(v => v.node.id === selectedVariant)?.node;
    if (!variant) return;

    addItem({
      product: { node: product },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity,
      selectedOptions: variant.selectedOptions,
    });

    toast.success('Produto adicionado ao carrinho!', {
      position: 'top-center',
    });
    setOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-xl text-muted-foreground mb-4">Produto não encontrado</p>
          <Link to="/" className="text-primary hover:underline">
            Voltar para a loja
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const currentVariant = product.variants.edges.find(v => v.node.id === selectedVariant)?.node;
  const price = currentVariant ? parseFloat(currentVariant.price.amount) : 0;
  const compareAtPrice = currentVariant?.compareAtPrice ? parseFloat(currentVariant.compareAtPrice.amount) : null;
  const discount = compareAtPrice ? calculateDiscount(compareAtPrice.toString(), price.toString()) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ChevronLeft className="w-4 h-4" />
          Voltar para a loja
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              {product.images.edges[selectedImage]?.node && (
                <img
                  src={product.images.edges[selectedImage].node.url}
                  alt={product.images.edges[selectedImage].node.altText || product.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            {product.images.edges.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {product.images.edges.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image.node.url}
                      alt={image.node.altText || `${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.title}</h1>
              
              <div className="flex items-center gap-3">
                {compareAtPrice && discount > 0 && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(compareAtPrice.toString())}
                    </span>
                    <span className="bg-store-danger text-foreground text-sm font-bold px-2 py-1 rounded">
                      {discount}% OFF
                    </span>
                  </>
                )}
                <span className="text-2xl font-bold">
                  {formatPrice(price.toString())}
                </span>
              </div>
              
              <p className="text-muted-foreground mt-1">
                ou 3x de {calculateInstallments(price.toString())} sem juros
              </p>
            </div>

            {/* Options */}
            {product.options.map((option) => (
              <div key={option.name}>
                <h3 className="font-medium mb-2">{option.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {option.values.map((value) => {
                    const variant = product.variants.edges.find(v => 
                      v.node.selectedOptions.some(o => o.name === option.name && o.value === value)
                    );
                    const isSelected = variant?.node.id === selectedVariant;
                    
                    return (
                      <button
                        key={value}
                        onClick={() => variant && setSelectedVariant(variant.node.id)}
                        className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                          isSelected 
                            ? 'border-primary bg-primary text-primary-foreground' 
                            : 'border-border hover:border-primary'
                        } ${!variant?.node.availableForSale ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={!variant?.node.availableForSale}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div>
              <h3 className="font-medium mb-2">Quantidade</h3>
              <div className="flex items-center gap-2 bg-secondary rounded-lg w-fit px-2 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-muted rounded"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-muted rounded"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              onClick={handleAddToCart}
              className="w-full py-6 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={!currentVariant?.availableForSale}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {currentVariant?.availableForSale ? 'Adicionar ao carrinho' : 'Produto indisponível'}
            </Button>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="font-medium mb-2">Descrição</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
