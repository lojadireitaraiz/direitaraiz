import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ShopifyAnalytics from "./components/ShopifyAnalytics";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import About from "./pages/About";
import TermsOfUse from "./pages/TermsOfUse";
import FAQ from "./pages/FAQ";
import ExchangesReturns from "./pages/ExchangesReturns";
import Collection from "./pages/Collection";
import NacaoKids from "./pages/NacaoKids";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter>
        <ScrollToTop />
        <ShopifyAnalytics />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/produto/:handle" element={<ProductDetail />} />
          <Route path="/privacidade" element={<PrivacyPolicy />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/termos" element={<TermsOfUse />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/trocas" element={<ExchangesReturns />} />
          <Route path="/colecao" element={<Collection />} />
          <Route path="/colecao/nacao-kids" element={<NacaoKids />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
