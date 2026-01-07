import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Loader2, Minus, Plus, ShoppingCart, Truck, Star, CreditCard, Shield, RefreshCw, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/store/Header';
import { Footer } from '@/components/store/Footer';
import { Button } from '@/components/ui/button';
import { fetchProductByHandle, formatPrice, calculateDiscount, calculateInstallments, ShopifyProduct } from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

  const nextImage = () => {
    if (product) {
      setSelectedImage((prev) => (prev + 1) % product.images.edges.length);
    }
  };

  const prevImage = () => {
    if (product) {
      setSelectedImage((prev) => (prev - 1 + product.images.edges.length) % product.images.edges.length);
    }
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
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Mobile Header */}
        <header className="flex flex-col gap-2 mb-6 lg:hidden">
          <p className="text-gray-400 text-sm uppercase">CAMISETA</p>
          <h1 className="font-medium text-2xl">{product.title}</h1>
          <div className="inline-flex items-center gap-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <span className="font-medium text-yellow-500">(42 avaliações)</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Images - Carousel */}
          <section className="relative">
            <div className="relative w-full aspect-square max-w-[740px] mx-auto overflow-hidden rounded-lg bg-gray-100">
              {product.images.edges[selectedImage]?.node && (
                <img
                  src={product.images.edges[selectedImage].node.url}
                  alt={product.images.edges[selectedImage].node.altText || product.title}
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Navigation Arrows */}
              {product.images.edges.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black text-white rounded-full w-11 h-11 flex items-center justify-center z-10 hover:bg-black/80 transition-colors"
                    aria-label="Imagem anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white rounded-full w-11 h-11 flex items-center justify-center z-10 hover:bg-black/80 transition-colors"
                    aria-label="Próxima imagem"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Dots Indicator */}
              {product.images.edges.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {product.images.edges.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        selectedImage === index ? 'bg-gray-800' : 'bg-gray-300'
                      }`}
                      aria-label={`Imagem ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnails - Desktop */}
            {product.images.edges.length > 1 && (
              <div className="hidden lg:flex gap-2 mt-4 overflow-x-auto no-scrollbar">
                {product.images.edges.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-black' : 'border-transparent'
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
          </section>

          {/* Product Details */}
          <section className="flex flex-col gap-5">
            {/* Desktop Header */}
            <header className="hidden lg:flex flex-col gap-2 mt-8">
              <p className="text-gray-400 text-sm uppercase">CAMISETA</p>
              <h1 className="font-medium text-2xl">{product.title}</h1>
              <div className="inline-flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="font-medium text-yellow-500">(42 avaliações)</span>
              </div>
            </header>

            {/* Price Section */}
            <div className="flex flex-col items-start gap-1 font-medium mt-5 lg:mt-0">
              <span className="flex flex-col justify-center flex-wrap gap-1 font-semibold">
                {compareAtPrice && discount > 0 && (
                  <del className="text-gray-500">
                    <p className="text-lg font-medium text-gray-500">
                      {formatPrice(compareAtPrice.toString())}
                    </p>
                  </del>
                )}
                <div className="flex items-center gap-2">
                  <p className="text-4xl font-medium">{formatPrice(price.toString())}</p>
                  {discount > 0 && (
                    <span className="text-sm text-green-800 font-medium py-1 px-3 leading-[21px] bg-green-100 rounded-md">
                      {discount}% OFF
                    </span>
                  )}
                </div>
              </span>
              <p className="font-medium text-base">
                ou em até <span className="text-green-500">3x de {calculateInstallments(price.toString())} sem juros</span>
              </p>
            </div>

            {/* Delivery Estimate */}
            <button className="flex mt-2 gap-2 items-center leading-4 text-blue-600 font-normal text-base">
              <MapPin className="w-5 h-5" />
              Calcule o prazo de entrega
            </button>

            {/* Options */}
            {product.options.map((option) => (
              <div key={option.name} className="flex flex-col items-start gap-2">
                <span className="font-medium text-gray-900">{option.name}</span>
                <div className="flex flex-wrap gap-3">
                  {option.values.map((value) => {
                    const variant = product.variants.edges.find(v => 
                      v.node.selectedOptions.some(o => o.name === option.name && o.value === value)
                    );
                    const isSelected = variant?.node.id === selectedVariant;
                    
                    return (
                      <button
                        key={value}
                        onClick={() => variant && setSelectedVariant(variant.node.id)}
                        className={`px-4 py-2 border rounded-full text-sm font-medium transition-colors ${
                          isSelected 
                            ? 'border-black bg-black text-white' 
                            : 'border-gray-300 hover:border-black bg-white text-gray-900'
                        } ${!variant?.node.availableForSale ? 'opacity-50 cursor-not-allowed line-through' : ''}`}
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
            <div className="flex flex-col items-start gap-2">
              <span className="font-medium text-gray-900">Quantidade</span>
              <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              className="w-full py-6 text-base font-medium bg-black text-white hover:bg-black/90 rounded-lg"
              disabled={!currentVariant?.availableForSale}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {currentVariant?.availableForSale ? 'Adicionar ao Carrinho' : 'Produto indisponível'}
            </Button>

            {/* Trust Badges */}
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex gap-2 items-start">
                <RefreshCw className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="leading-5 text-gray-500 text-sm">
                  <em className="text-green-500 not-italic font-medium">Primeira troca grátis.</em>{' '}
                  Você tem até 30 dias para trocar o produto.
                </span>
              </div>
              <div className="flex gap-2 items-start">
                <Shield className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="leading-5 text-gray-500 text-sm">
                  <em className="text-green-500 not-italic font-medium">Compra segura.</em>{' '}
                  Site construído para a sua segurança.
                </span>
              </div>
            </div>

            {/* Payment Icons */}
            <div className="flex gap-2 mt-2">
              <img src="https://d2u4gk28rgr5ys.cloudfront.net/assets/icons/cards/visa-4c562b0e312e36ce0daadaf465d3759ca162cb39c6a828454a5cfb2c95f8e26a.svg" alt="Visa" className="w-10 h-6" />
              <img src="https://d2u4gk28rgr5ys.cloudfront.net/assets/icons/cards/master-f27cb6ce5923f7f52ceded3fdc486079492ac922931c00db634211bb5453b11c.svg" alt="Mastercard" className="w-10 h-6" />
              <img src="https://d2u4gk28rgr5ys.cloudfront.net/assets/icons/cards/elo-c40efbc3640e09e5b4acd03ee7f09dd31d521959516adf224f007458739d77e3.svg" alt="Elo" className="w-10 h-6" />
              <img src="https://d2u4gk28rgr5ys.cloudfront.net/assets/icons/cards/amex-6f16117e3c9e8a546737b6951c187f2014009b8b40e374dc0c846561ea66c663.svg" alt="Amex" className="w-10 h-6" />
              <img src="https://d2u4gk28rgr5ys.cloudfront.net/assets/icons/cards/dinners-32c627a8ea96ce8e10b78feafe65bb95ae948af63539dcb9fea45a8c376a419f.svg" alt="Diners" className="w-10 h-6" />
              <img src="https://d2u4gk28rgr5ys.cloudfront.net/assets/icons/cards/pix-39099f2f23f9b0fcc7e66c2759d247b7f04e7bd44b8b8f1103aaa2ee28c0f86d.svg" alt="Pix" className="w-10 h-6" />
            </div>
          </section>
        </div>

        {/* Product Tabs */}
        <div className="mt-10 border-t border-gray-200 pt-6">
          <Tabs defaultValue="fabricacao" className="w-full">
            <TabsList className="w-full justify-center bg-transparent border-b border-gray-200 rounded-none h-auto p-0">
              <TabsTrigger 
                value="fabricacao" 
                className="px-4 py-3 border-b-2 border-transparent data-[state=active]:border-gray-800 data-[state=active]:bg-transparent rounded-none text-gray-500 data-[state=active]:text-gray-800 font-medium"
              >
                Fabricação
              </TabsTrigger>
              <TabsTrigger 
                value="material"
                className="px-4 py-3 border-b-2 border-transparent data-[state=active]:border-gray-800 data-[state=active]:bg-transparent rounded-none text-gray-500 data-[state=active]:text-gray-800 font-medium"
              >
                Material
              </TabsTrigger>
            </TabsList>
            <TabsContent value="fabricacao" className="p-4 bg-gray-50 rounded-lg mt-4">
              <p className="text-base text-gray-700 font-medium">
                Criada no Brasil e feita pro mundo, todos nossos produtos são feitos sob demanda
                para você usando tecnologia de ponta na estamparia.
              </p>
            </TabsContent>
            <TabsContent value="material" className="p-4 bg-gray-50 rounded-lg mt-4">
              <p className="text-base text-gray-700 font-medium">
                Nossas camisetas são de excelência em algodão brasileiro, ideais para todos os climas. 
                Todas as cores são 100% algodão; exceto cinzas: 88% algodão e 12% poliéster.
              </p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Benefits Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-10">
          <div className="flex flex-col bg-gray-50 rounded-lg px-4 py-6 items-center text-center">
            <Truck className="w-8 h-8 mb-2 text-gray-700" />
            <p className="text-sm leading-tight font-bold text-gray-900">Primeira troca grátis</p>
            <p className="text-sm leading-tight font-normal text-gray-500">A primeira troca é gratuita, sem complicação</p>
          </div>
          <div className="flex flex-col bg-gray-50 rounded-lg px-4 py-6 items-center text-center">
            <Star className="w-8 h-8 mb-2 text-gray-700" />
            <p className="text-sm leading-tight font-bold text-gray-900">Alta qualidade</p>
            <p className="text-sm leading-tight font-normal text-gray-500">Produtos feitos de algodão premium</p>
          </div>
          <div className="flex flex-col bg-gray-50 rounded-lg px-4 py-6 items-center text-center">
            <CreditCard className="w-8 h-8 mb-2 text-gray-700" />
            <p className="text-sm leading-tight font-bold text-gray-900">Até 3x sem juros</p>
            <p className="text-sm leading-tight font-normal text-gray-500">Sem mínimo necessário</p>
          </div>
          <div className="flex flex-col bg-gray-50 rounded-lg px-4 py-6 items-center text-center">
            <MapPin className="w-8 h-8 mb-2 text-gray-700" />
            <p className="text-sm leading-tight font-bold text-gray-900">Todo o Brasil</p>
            <p className="text-sm leading-tight font-normal text-gray-500">Envio para todas regiões brasileiras</p>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-10">
            <h3 className="font-medium text-xl mb-4">Descrição do Produto</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>
        )}
      </main>

      {/* Mobile Add to Cart Fixed Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 lg:hidden z-30">
        <Button
          onClick={handleAddToCart}
          className="w-full py-4 text-base font-medium bg-black text-white hover:bg-black/90 rounded-lg"
          disabled={!currentVariant?.availableForSale}
        >
          {currentVariant?.availableForSale ? 'Adicionar ao Carrinho' : 'Produto indisponível'}
        </Button>
      </div>

      <div className="pb-20 lg:pb-0">
        <Footer />
      </div>
    </div>
  );
}
