import { Heart, ShoppingCart, Eye, Star } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AIBadge } from "./AIBadge";
import { useState } from "react";
import type { ProductWithDetails } from "@shared/schema";

interface ProductCardProps {
  product: ProductWithDetails;
  onAddToCart?: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
}

export function ProductCard({ product, onAddToCart, onAddToWishlist }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [, navigate] = useLocation();
  const imageUrl = product.images[0] || "/placeholder-product.png";

  return (
    <Card
      className="group overflow-hidden transition-all duration-300 hover-elevate"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`card-product-${product.id}`}
    >
      {/* Image Container */}
      <Link href={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          data-testid={`img-product-${product.id}`}
        />
        
        {/* AI Badge */}
        {product.isAiGenerated && (
          <div className="absolute top-3 right-3">
            <AIBadge />
          </div>
        )}

        {/* Quick Actions */}
        <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="h-10 w-10 rounded-full"
              onClick={(e) => {
                e.preventDefault();
                onAddToWishlist?.(product.id);
              }}
              data-testid={`button-wishlist-${product.id}`}
            >
              <Heart className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-10 w-10 rounded-full"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/product/${product.slug}`);
              }}
              data-testid={`button-view-${product.id}`}
            >
              <Eye className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <h3 
          className="font-semibold text-lg mb-1 line-clamp-2 hover:text-primary transition-colors cursor-pointer" 
          onClick={() => navigate(`/product/${product.slug}`)}
          data-testid={`text-product-name-${product.id}`}
        >
          {product.name}
        </h3>
        
        {product.category && (
          <p className="text-sm text-muted-foreground mb-2" data-testid={`text-category-${product.id}`}>
            {product.category.name}
          </p>
        )}

        {/* Rating */}
        {product.averageRating && product.reviewCount ? (
          <div className="flex items-center gap-1 mb-3">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.averageRating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">({product.reviewCount})</span>
          </div>
        ) : null}

        {/* Price & Cart */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-primary" data-testid={`text-price-${product.id}`}>
              GH₵{parseFloat(product.price).toFixed(2)}
            </p>
            {product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price) && (
              <p className="text-sm text-muted-foreground line-through">
                GH₵{parseFloat(product.compareAtPrice).toFixed(2)}
              </p>
            )}
          </div>
          <Button
            size="icon"
            onClick={() => onAddToCart?.(product.id)}
            disabled={product.stock === 0}
            data-testid={`button-add-cart-${product.id}`}
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>

        {/* Stock Status */}
        {product.stock === 0 ? (
          <p className="text-sm text-destructive mt-2">Out of Stock</p>
        ) : product.stock < 10 ? (
          <p className="text-sm text-yellow-600 mt-2">Only {product.stock} left</p>
        ) : null}
      </div>
    </Card>
  );
}
