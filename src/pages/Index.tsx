import { Header } from '@/components/store/Header';
import { HeroBanner } from '@/components/store/HeroBanner';
import { MiniBanners } from '@/components/store/MiniBanners';
import { PromoAlert } from '@/components/store/PromoAlert';
import { ProductGrid } from '@/components/store/ProductGrid';
import { Footer } from '@/components/store/Footer';

// Promo end date - 7 days from now
const promoEndDate = new Date();
promoEndDate.setDate(promoEndDate.getDate() + 7);

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <PromoAlert 
        message="FRETE GRÁTIS A PARTIR DE 3 PEÇAS" 
        endDate={promoEndDate}
      />
      
      <main>
        <HeroBanner />
        <MiniBanners />
        <ProductGrid collectionFilter="direita-raiz" />
      </main>

      <Footer />
    </div>
  );
}
