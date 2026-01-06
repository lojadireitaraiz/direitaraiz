import { Minus, Plus, Trash2, X, Loader2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { formatPrice } from '@/lib/shopify';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

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
    getTotalItems,
  } = useCartStore();

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

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full bg-secondary border-border p-0">
        <SheetHeader className="p-4 bg-muted border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-foreground">
              <ShoppingBag className="w-5 h-5" />
              Carrinho
              <span className="text-muted-foreground">
                ({totalItems} {totalItems === 1 ? 'produto' : 'produtos'})
              </span>
            </SheetTitle>
            <button onClick={() => setOpen(false)} className="hover:bg-muted rounded-full p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </SheetHeader>

        <div className="flex flex-col flex-1 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Seu carrinho está vazio</p>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {items.map((item) => (
                  <div key={item.variantId} className="cart-item bg-muted rounded-lg">
                    <div className="cart-item-image">
                      {item.product.node.images?.edges?.[0]?.node && (
                        <img
                          src={item.product.node.images.edges[0].node.url}
                          alt={item.product.node.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    
                    <div className="cart-item-info">
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-sm line-clamp-1">
                              {item.product.node.title}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {item.selectedOptions.map(o => o.value).join(' / ')}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.variantId)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="font-semibold text-sm mt-1">
                          {formatPrice(item.price.amount, item.price.currencyCode)}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-background rounded-md w-fit px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="p-1 hover:bg-muted rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="p-1 hover:bg-muted rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border bg-muted space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium">Subtotal</span>
                  <span className="text-base">{formatPrice(totalPrice.toString())}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <div className="text-right">
                    <p className="text-lg font-bold">{formatPrice(totalPrice.toString())}</p>
                    <p className="text-xs text-muted-foreground">
                      ou 3x de {formatPrice((totalPrice / 3).toString())}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-base font-medium"
                  disabled={items.length === 0 || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    'Finalizar compra'
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
