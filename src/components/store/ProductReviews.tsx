import { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Check } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  content: string;
  helpful: number;
  notHelpful: number;
  verified: boolean;
  productName?: string;
  image?: string;
}

const mockReviews: Review[] = [
  {
    id: '1',
    author: 'João carlos s.',
    rating: 5,
    date: '08 de Setembro de 2025',
    content: 'Produto de excelente qualidade! Superou minhas expectativas. O tecido é muito macio e confortável. Recomendo demais!',
    helpful: 12,
    notHelpful: 0,
    verified: true,
    productName: 'Magnitsky',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
  },
  {
    id: '2',
    author: 'Maria S.',
    rating: 5,
    date: '05 de Setembro de 2025',
    content: 'Amei o caimento e a qualidade do algodão. Comprei para dar de presente e a pessoa amou! Com certeza vou comprar mais.',
    helpful: 8,
    notHelpful: 0,
    verified: true,
    productName: 'Magnitsky',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=400&fit=crop',
  },
  {
    id: '3',
    author: 'Pedro L.',
    rating: 5,
    date: '01 de Setembro de 2025',
    content: 'Muito boa, o acabamento é impecável. Chegou super rápido e bem embalado. A estampa é linda e não desbota.',
    helpful: 5,
    notHelpful: 1,
    verified: true,
    productName: 'Magnitsky',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop',
  },
  {
    id: '4',
    author: 'Ana C.',
    rating: 5,
    date: '28 de Agosto de 2025',
    content: 'Já é a terceira vez que compro aqui e sempre fico satisfeita. O algodão é macio e não encolhe na lavagem.',
    helpful: 15,
    notHelpful: 0,
    verified: true,
    productName: 'Magnitsky',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop',
  },
];

const ratingDistribution = [
  { stars: 5, count: 40 },
  { stars: 4, count: 1 },
  { stars: 3, count: 1 },
  { stars: 2, count: 0 },
  { stars: 1, count: 0 },
];

export function ProductReviews() {
  const [helpfulClicked, setHelpfulClicked] = useState<Set<string>>(new Set());
  const [notHelpfulClicked, setNotHelpfulClicked] = useState<Set<string>>(new Set());

  const totalReviews = ratingDistribution.reduce((sum, r) => sum + r.count, 0);
  const averageRating = (ratingDistribution.reduce((sum, r) => sum + r.stars * r.count, 0) / totalReviews).toFixed(1);

  const handleHelpful = (reviewId: string) => {
    setHelpfulClicked(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
        // Remove from not helpful if clicked
        setNotHelpfulClicked(p => {
          const s = new Set(p);
          s.delete(reviewId);
          return s;
        });
      }
      return newSet;
    });
  };

  const handleNotHelpful = (reviewId: string) => {
    setNotHelpfulClicked(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
        // Remove from helpful if clicked
        setHelpfulClicked(p => {
          const s = new Set(p);
          s.delete(reviewId);
          return s;
        });
      }
      return newSet;
    });
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'sm') => {
    const sizeClasses = {
      sm: 'w-3.5 h-3.5',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    };
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  // Photos reviews (ones with images)
  const photoReviews = mockReviews.filter(r => r.image);

  return (
    <section className="mt-10 border-t border-gray-200 pt-8">
      {/* Photo Reviews Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Fotos de avaliações</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {photoReviews.map((review) => (
            <div key={review.id} className="flex-shrink-0 relative">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                <img 
                  src={review.image} 
                  alt={`Avaliação de ${review.author}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-1 left-1 right-1 bg-white/90 backdrop-blur-sm rounded px-1.5 py-0.5 flex items-center gap-1">
                <span className="text-xs font-bold">{review.rating.toFixed(1)}</span>
                {renderStars(review.rating, 'sm')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Reviews Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Avaliações</h2>
        
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          {/* Average Rating */}
          <div className="flex items-center gap-4">
            <div className="text-5xl font-bold text-gray-900">{averageRating}</div>
            <div>
              <div className="flex items-center gap-2">
                {renderStars(Math.round(parseFloat(averageRating)), 'lg')}
                <span className="text-gray-500 text-sm">({averageRating})</span>
              </div>
              <p className="text-gray-500 text-sm mt-0.5">{totalReviews} avaliações</p>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 max-w-sm">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-2 mb-1.5">
                <span className="text-sm text-gray-700 w-4 font-medium">{item.stars}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 rounded-full transition-all"
                    style={{ width: `${(item.count / totalReviews) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-20">
                  {item.count} {item.count === 1 ? 'avaliação' : 'avaliações'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-0">
        {mockReviews.map((review, index) => (
          <div 
            key={review.id} 
            className={`py-5 ${index !== mockReviews.length - 1 ? 'border-b border-gray-100' : ''}`}
          >
            <div className="flex flex-col gap-2">
              {/* Stars and Header */}
              <div className="flex items-start justify-between">
                <div>
                  {renderStars(review.rating, 'md')}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-semibold text-gray-900">{review.author}</span>
                    <span className="text-gray-400 text-sm">{review.date}</span>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {review.verified && (
                  <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full">
                    <Check className="w-3 h-3" />
                    Compra verificada
                  </span>
                )}
              </div>

              {/* Product Purchased */}
              {review.productName && (
                <p className="text-sm text-gray-500">
                  Produtos comprados: <span className="text-gray-700">{review.productName}</span>
                </p>
              )}

              {/* Review Content */}
              <p className="text-gray-700 leading-relaxed">{review.content}</p>

              {/* Helpful Section */}
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-gray-500">Isso foi útil para você?</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleHelpful(review.id)}
                    className={`flex items-center gap-1 text-sm transition-colors ${
                      helpfulClicked.has(review.id)
                        ? 'text-green-600'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{review.helpful + (helpfulClicked.has(review.id) ? 1 : 0)}</span>
                  </button>
                  <button
                    onClick={() => handleNotHelpful(review.id)}
                    className={`flex items-center gap-1 text-sm transition-colors ${
                      notHelpfulClicked.has(review.id)
                        ? 'text-red-500'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span>{review.notHelpful + (notHelpfulClicked.has(review.id) ? 1 : 0)}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
