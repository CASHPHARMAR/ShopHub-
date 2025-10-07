import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProductCard } from "@/components/ProductCard";
import { CategoryCard } from "@/components/CategoryCard";
import { AIBadge } from "@/components/AIBadge";
import { Sparkles, Search, ShoppingBag, Shield, Truck, CreditCard, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { ProductWithDetails, Category } from "@shared/schema";

export default function HomePage() {
  // Fetch featured products
  const { data: featuredProducts = [] } = useQuery<ProductWithDetails[]>({
    queryKey: ["/api/products/featured"],
  });

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-purple-500/5 to-pink-500/5">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative z-10 mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <AIBadge size="default" className="mb-4" />
              <h1 className="font-accent text-5xl md:text-7xl font-bold leading-tight" data-testid="text-hero-title">
                AI-Powered Shopping,{" "}
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Redefined
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl" data-testid="text-hero-subtitle">
                Discover products with intelligent search, get personalized recommendations, and enjoy seamless shopping powered by AI
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild data-testid="button-start-shopping">
                  <Link href="/products">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Start Shopping
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild data-testid="button-become-seller">
                  <Link href="/seller/dashboard">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Sell With AI
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Content - Feature Highlights */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 hover-elevate">
                <Search className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Smart Search</h3>
                <p className="text-sm text-muted-foreground">Find products using natural language</p>
              </Card>
              <Card className="p-6 hover-elevate">
                <Sparkles className="h-8 w-8 text-purple-500 mb-3" />
                <h3 className="font-semibold mb-2">AI Recommendations</h3>
                <p className="text-sm text-muted-foreground">Personalized product suggestions</p>
              </Card>
              <Card className="p-6 hover-elevate">
                <Shield className="h-8 w-8 text-green-500 mb-3" />
                <h3 className="font-semibold mb-2">Secure Payments</h3>
                <p className="text-sm text-muted-foreground">MTN MoMo & more options</p>
              </Card>
              <Card className="p-6 hover-elevate">
                <Truck className="h-8 w-8 text-blue-500 mb-3" />
                <h3 className="font-semibold mb-2">Fast Delivery</h3>
                <p className="text-sm text-muted-foreground">Track your orders in real-time</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-accent text-3xl font-bold mb-2" data-testid="text-featured-title">
                  Featured Products
                </h2>
                <p className="text-muted-foreground">Handpicked items just for you</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/products" data-testid="link-view-all-products">View All</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-accent text-3xl font-bold mb-4" data-testid="text-categories-title">
                Shop by Category
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore our wide range of categories and find exactly what you're looking for
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.slice(0, 4).map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* AI Features Showcase */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <AIBadge size="default" className="mx-auto mb-4" />
            <h2 className="font-accent text-3xl font-bold mb-4">
              Powered by AI
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the future of e-commerce with our AI-powered features
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover-elevate">
              <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-accent text-xl font-semibold mb-3">Product Descriptions</h3>
              <p className="text-muted-foreground">
                AI-generated, detailed product descriptions that help you make informed decisions
              </p>
            </Card>
            <Card className="p-8 text-center hover-elevate">
              <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-accent text-xl font-semibold mb-3">Smart Search</h3>
              <p className="text-muted-foreground">
                Search using natural language and find exactly what you're looking for
              </p>
            </Card>
            <Card className="p-8 text-center hover-elevate">
              <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-accent text-xl font-semibold mb-3">Recommendations</h3>
              <p className="text-muted-foreground">
                Get personalized product recommendations based on your preferences
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h4 className="font-semibold mb-2">Secure Payments</h4>
              <p className="text-sm text-muted-foreground">MTN MoMo & Paystack</p>
            </div>
            <div>
              <Truck className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h4 className="font-semibold mb-2">Fast Delivery</h4>
              <p className="text-sm text-muted-foreground">Track in real-time</p>
            </div>
            <div>
              <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h4 className="font-semibold mb-2">10,000+ Customers</h4>
              <p className="text-sm text-muted-foreground">Join our community</p>
            </div>
            <div>
              <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h4 className="font-semibold mb-2">Buyer Protection</h4>
              <p className="text-sm text-muted-foreground">Shop with confidence</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
