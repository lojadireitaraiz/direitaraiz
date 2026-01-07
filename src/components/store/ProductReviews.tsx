import { useState } from 'react';
import { Star, ThumbsUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  helpful: number;
  verified: boolean;
  size?: string;
}

const mockReviews: Review[] = [
  {
    id: '1',
    author: 'João M.',
    rating: 5,
    date: '15 de dezembro de 2025',
    title: 'Qualidade excepcional!',
    content: 'Camiseta muito confortável, o tecido é de excelente qualidade. O tamanho veio certinho e a estampa está perfeita. Recomendo demais!',
    helpful: 12,
    verified: true,
    size: 'M',
  },
  {
    id: '2',
    author: 'Maria S.',
    rating: 5,
    date: '10 de dezembro de 2025',
    title: 'Amei o caimento',
    content: 'Comprei para dar de presente e a pessoa amou! O acabamento é impecável e chegou super rápido. Com certeza vou comprar mais.',
    helpful: 8,
    verified: true,
    size: 'G',
  },
  {
    id: '3',
    author: 'Pedro L.',
    rating: 4,
    date: '5 de dezembro de 2025',
    title: 'Muito boa, mas demorou um pouco',
    content: 'Produto de qualidade, bem feito. Só achei que demorou um pouco pra chegar, mas valeu a pena esperar. A camiseta é linda!',
    helpful: 5,
    verified: true,
    size: 'GG',
  },
  {
    id: '4',
    author: 'Ana C.',
    rating: 5,
    date: '1 de dezembro de 2025',
    title: 'Perfeita!',
    content: 'Já é a terceira vez que compro aqui e sempre fico satisfeita. O algodão é macio e não encolhe na lavagem. Super recomendo!',
    helpful: 15,
    verified: true,
    size: 'P',
  },
];

const ratingDistribution = [
  { stars: 5, count: 35 },
  { stars: 4, count: 5 },
  { stars: 3, count: 2 },
  { stars: 2, count: 0 },
  { stars: 1, count: 0 },
];

export function ProductReviews() {
  const [showAll, setShowAll] = useState(false);
  const [helpfulClicked, setHelpfulClicked] = useState<Set<string>>(new Set());

  const totalReviews = ratingDistribution.reduce((sum, r) => sum + r.count, 0);
  const averageRating = ratingDistribution.reduce((sum, r) => sum + r.stars * r.count, 0) / totalReviews;

  const displayedReviews = showAll ? mockReviews : mockReviews.slice(0, 3);

  const handleHelpful = (reviewId: string) => {
    setHelpfulClicked(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const starSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="mt-10 border-t border-gray-200 pt-8">
      <h2 className="text-2xl font-semibold mb-6">Avaliações dos Clientes</h2>

      {/* Rating Summary */}
      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        {/* Average Rating */}
        <div className="flex flex-col items-center lg:items-start">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold">{averageRating.toFixed(1)}</span>
            <span className="text-gray-500 text-lg">/5</span>
          </div>
          <div className="mt-2">{renderStars(Math.round(averageRating), 'md')}</div>
          <p className="text-gray-500 mt-1">{totalReviews} avaliações</p>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1 max-w-md">
          {ratingDistribution.map((item) => (
            <div key={item.stars} className="flex items-center gap-3 mb-2">
              <span className="text-sm text-gray-600 w-14">{item.stars} estrelas</span>
              <Progress 
                value={(item.count / totalReviews) * 100} 
                className="h-2 flex-1"
              />
              <span className="text-sm text-gray-500 w-8">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {displayedReviews.map((review) => (
          <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {renderStars(review.rating)}
                  {review.verified && (
                    <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded">
                      Compra verificada
                    </span>
                  )}
                </div>
                <h4 className="font-semibold text-gray-900">{review.title}</h4>
              </div>
              <span className="text-sm text-gray-400">{review.date}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span className="font-medium">{review.author}</span>
              {review.size && (
                <>
                  <span>•</span>
                  <span>Tamanho: {review.size}</span>
                </>
              )}
            </div>

            <p className="text-gray-700 leading-relaxed mb-3">{review.content}</p>

            <button
              onClick={() => handleHelpful(review.id)}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                helpfulClicked.has(review.id)
                  ? 'text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>
                Útil ({review.helpful + (helpfulClicked.has(review.id) ? 1 : 0)})
              </span>
            </button>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      {mockReviews.length > 3 && (
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="gap-2"
          >
            {showAll ? 'Ver menos' : 'Ver todas as avaliações'}
            <ChevronDown className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      )}
    </section>
  );
}
