import { Header } from '@/components/store/Header';
import { Footer } from '@/components/store/Footer';
import { Package, RotateCcw, Clock, Mail } from 'lucide-react';

export default function ExchangesReturns() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
          Trocas e Devoluções
        </h1>
        
        <div className="space-y-8">
          {/* Devolução */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <RotateCcw className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  Como funciona o processo de devolução e reembolso?
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  O cliente tem até <strong>7 dias corridos</strong> a partir do recebimento do produto para solicitar a devolução. Para isso, basta acessar a área de pedidos na página da loja, selecionar o pedido em questão e iniciar a solicitação de devolução. Durante a solicitação, o cliente deverá fornecer o motivo da devolução.
                </p>
              </div>
            </div>
          </div>
          
          {/* Troca */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  Como é o processo de troca?
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  O prazo para troca ser solicitada é de até <strong>30 dias corridos</strong> após o recebimento do produto. Nos casos de defeito o prazo de trocas é de <strong>90 dias</strong> após o recebimento do produto.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Para iniciar uma solicitação de troca, o cliente deve fazer cadastro/login com o mesmo e-mail de compra e acessar a área de pedidos. Lá, ele encontrará a opção de solicitar uma troca. Após selecionar o pedido e o item que deseja trocar, o cliente poderá indicar o motivo da troca e seguir as instruções fornecidas pelo sistema.
                </p>
              </div>
            </div>
          </div>
          
          {/* Prazos Resumo */}
          <div className="bg-muted/50 border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Resumo dos Prazos</h3>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span><strong>Devolução:</strong> até 7 dias corridos após o recebimento</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span><strong>Troca:</strong> até 30 dias corridos após o recebimento</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span><strong>Troca por defeito:</strong> até 90 dias após o recebimento</span>
              </li>
            </ul>
          </div>
          
          {/* Contato */}
          <div className="text-center pt-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Mail className="w-5 h-5 text-primary" />
              <p className="text-muted-foreground">
                Precisa de ajuda? Entre em contato:
              </p>
            </div>
            <a 
              href="mailto:suporte@direitaraiz.com" 
              className="text-primary hover:underline font-medium text-lg"
            >
              suporte@direitaraiz.com
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
