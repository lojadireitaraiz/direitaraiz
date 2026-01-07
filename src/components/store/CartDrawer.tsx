import { useState } from 'react';
import { Minus, Plus, Loader2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { formatPrice } from '@/lib/shopify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
export function CartDrawer() {
  const {
    items,
    isOpen,
    isLoading,
    setOpen,
    updateQuantity,
    removeItem,
    createCheckout,
    getTotalPrice,
    getTotalItems
  } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [cepCode, setCepCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const handleCheckout = async () => {
    try {
      await createCheckout();
      const checkoutUrl = useCartStore.getState().checkoutUrl;
      if (checkoutUrl) {
        window.open(checkoutUrl, '_blank');
        setOpen(false);
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };
  const handleApplyCoupon = () => {
    // Placeholder for coupon logic
    if (couponCode.toUpperCase() === 'DESCONTO10') {
      setDiscount(10);
    }
  };
  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();
  const totalPrice = subtotal - discount;
  return <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-background border-border p-0">
        {/* Header */}
        <SheetHeader className="p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-foreground text-base font-medium">
              <ShoppingBag className="w-5 h-5" />
              Carrinho ({totalItems} {totalItems === 1 ? 'produto' : 'produtos'})
            </SheetTitle>
            <button onClick={() => setOpen(false)} className="hover:bg-muted rounded-full p-1 transition-colors">
              
            </button>
          </div>
        </SheetHeader>

        <div className="flex flex-col flex-1 min-h-0">
          {items.length === 0 ? <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Seu carrinho está vazio</p>
              </div>
            </div> : <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {items.map(item => {
              const originalPrice = item.product.node.compareAtPriceRange?.minVariantPrice?.amount;
              const currentPrice = item.price.amount;
              const hasDiscount = originalPrice && parseFloat(originalPrice) > parseFloat(currentPrice);
              return <div key={item.variantId} className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-28 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        {item.product.node.images?.edges?.[0]?.node && <img src={item.product.node.images.edges[0].node.url} alt={item.product.node.title} className="w-full h-full object-cover" />}
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-medium text-sm text-foreground line-clamp-2">
                              {item.product.node.title}
                            </h4>
                            <div className="text-right flex-shrink-0">
                              {hasDiscount && <p className="text-xs text-muted-foreground line-through">
                                  {formatPrice(originalPrice, item.price.currencyCode)}
                                </p>}
                              <p className="font-semibold text-sm text-foreground">
                                {formatPrice(currentPrice, item.price.currencyCode)}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.selectedOptions.map(o => o.value).join(' / ')}
                          </p>
                        </div>
                        
                        {/* Quantity Selector */}
                        <div className="flex items-center border border-border rounded-md w-fit mt-2">
                          <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="p-2 hover:bg-muted transition-colors">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="p-2 hover:bg-muted transition-colors">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>;
            })}
              </div>

              {/* Footer Section */}
              <div className="flex-shrink-0 border-t border-border bg-background">
                {/* Cupom */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <span className="text-sm font-medium text-foreground">Cupom</span>
                  <div className="flex items-center gap-2">
                    <Input type="text" placeholder="CUPOM" value={couponCode} onChange={e => setCouponCode(e.target.value)} className="w-32 h-9 text-center text-sm border-border rounded-full" />
                    <button onClick={handleApplyCoupon} className="p-2 hover:bg-muted rounded-full transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Frete */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <span className="text-sm font-medium text-foreground">Frete</span>
                  <div className="flex items-center gap-2">
                    <Input type="text" placeholder="Insira seu CEP" value={cepCode} onChange={e => setCepCode(e.target.value)} className="w-32 h-9 text-center text-sm border-border rounded-full" />
                    <button className="p-2 hover:bg-muted rounded-full transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-foreground">Subtotal</span>
                  <span className="text-sm text-foreground">{formatPrice(subtotal.toString())}</span>
                </div>

                {/* Desconto */}
                {discount > 0 && <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-foreground">Desconto</span>
                    <span className="text-sm text-emerald-600">-{formatPrice(discount.toString())}</span>
                  </div>}

                {/* Total */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                  <span className="text-base font-semibold text-foreground">Total</span>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">{formatPrice(totalPrice.toString())}</p>
                    <p className="text-xs text-muted-foreground">
                      ou 3x de {formatPrice((totalPrice / 3).toString())}
                    </p>
                  </div>
                </div>

                {/* Checkout Button */}
                <div className="p-4">
                  <Button onClick={handleCheckout} className="w-full bg-black text-white hover:bg-black/90 py-6 text-base font-medium rounded-full" disabled={items.length === 0 || isLoading}>
                    {isLoading ? <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processando...
                      </> : 'Finalizar compra'}
                  </Button>
                </div>
              </div>
            </>}
        </div>
      </SheetContent>
    </Sheet>;
}