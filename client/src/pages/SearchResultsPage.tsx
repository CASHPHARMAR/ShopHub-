import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AIBadge } from "@/components/AIBadge";
import { useState, useEffect } from "react";
import type { ProductWithDetails } from "@shared/schema";

export default function SearchResultsPage() {
  const [location, navigate] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1]);
  const initialQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  const { data: products = [], isLoading } = useQuery<ProductWithDetails[]>({
    queryKey: [`/api/ai/search?query=${initialQuery}`],
    enabled: !!initialQuery,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h1 className="font-accent text-3xl font-bold">Search Results</h1>
          <AIBadge />
        </div>
        <p className="text-muted-foreground mb-6">
          Powered by AI to find exactly what you're looking for
        </p>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products with AI..."
              className="w-full pl-10 pr-24"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-page"
            />
            <Button 
              type="submit" 
              size="sm" 
              className="absolute right-1 top-1/2 -translate-y-1/2"
              data-testid="button-search"
            >
              Search
            </Button>
          </div>
        </form>
      </div>

      {/* Results */}
      {initialQuery && (
        <>
          <div className="mb-6">
            <p className="text-muted-foreground" data-testid="text-search-query">
              Showing results for: <span className="font-semibold text-foreground">"{initialQuery}"</span>
            </p>
            {!isLoading && (
              <p className="text-sm text-muted-foreground mt-1" data-testid="text-results-count">
                {products.length} {products.length === 1 ? 'product' : 'products'} found
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted rounded-lg mb-4" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No products found</h2>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search terms or browse our categories
              </p>
              <Button onClick={() => navigate("/")} data-testid="button-browse-categories">
                Browse Categories
              </Button>
            </div>
          )}
        </>
      )}

      {!initialQuery && (
        <div className="text-center py-16">
          <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Start your search</h2>
          <p className="text-muted-foreground">
            Enter a search term above to find products
          </p>
        </div>
      )}
    </div>
  );
}
