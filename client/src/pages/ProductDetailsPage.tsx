import { useParams, useLocation } from "wouter";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star, Heart, ShoppingCart, Minus, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AIBadge } from "@/components/AIBadge";
import { ReviewCard } from "@/components/ReviewCard";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProductWithDetails, ReviewWithUser } from "@shared/schema";

export default function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useQuery<ProductWithDetails>({
    queryKey: [`/api/products/${slug}`],
  });

  const { data: reviews = [] } = useQuery<ReviewWithUser[]>({
    queryKey: [`/api/products/${slug}/reviews`],
    enabled: !!product,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted rounded-lg" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-12 bg-muted rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Button onClick={() => navigate("/")}>Back to Home</Button>
      </div>
    );
  }

  const images = product.images.length > 0 ? product.images : ["/placeholder-product.png"];
  const averageRating = product.averageRating || 0;
  const reviewCount = product.reviewCount || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-xl border">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="h-full w-full object-cover"
              data-testid="img-product-main"
            />
            {product.isAiGenerated && (
              <div className="absolute top-4 right-4">
                <AIBadge />
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImage === idx ? "border-primary" : "border-transparent"
                  }`}
                  data-testid={`button-thumbnail-${idx}`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <h1 className="font-accent text-4xl font-bold mb-3" data-testid="text-product-title">
              {product.name}
            </h1>
            {product.category && (
              <Badge variant="secondary" data-testid="badge-category">
                {product.category.name}
              </Badge>
            )}
          </div>

          {/* Rating */}
          {reviewCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">{averageRating.toFixed(1)}</span>
              <span className="text-muted-foreground">({reviewCount} reviews)</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <p className="text-4xl font-bold text-primary" data-testid="text-product-price">
              GH₵{parseFloat(product.price).toFixed(2)}
            </p>
            {product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price) && (
              <p className="text-xl text-muted-foreground line-through">
                GH₵{parseFloat(product.compareAtPrice).toFixed(2)}
              </p>
            )}
          </div>

          {/* Stock Status */}
          <div>
            {product.stock > 0 ? (
              <Badge variant="outline" className="border-green-500 text-green-600">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2" />
                In Stock ({product.stock} available)
              </Badge>
            ) : (
              <Badge variant="outline" className="border-red-500 text-red-600">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Description */}
          {product.shortDescription && (
            <p className="text-lg text-foreground" data-testid="text-product-description">
              {product.shortDescription}
            </p>
          )}

          <Separator />

          {/* Quantity & Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="font-semibold">Quantity:</label>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  data-testid="button-decrease-quantity"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium" data-testid="text-quantity">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  data-testid="button-increase-quantity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1"
                disabled={product.stock === 0}
                data-testid="button-add-to-cart"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" data-testid="button-add-to-wishlist">
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Seller Info */}
          {product.seller && (
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-accent font-semibold text-primary">
                    {product.seller.name[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sold by</p>
                  <p className="font-semibold">{product.seller.shopName || product.seller.name}</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-16">
        <Tabs defaultValue="description">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviewCount})</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <Card className="p-6">
              {product.longDescription ? (
                <div className="prose max-w-none" data-testid="text-long-description">
                  {product.longDescription}
                </div>
              ) : (
                <p className="text-muted-foreground">No detailed description available.</p>
              )}
            </Card>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))
              ) : (
                <Card className="p-6 text-center">
                  <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
