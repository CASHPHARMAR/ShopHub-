import { Package, Heart, ShoppingBag, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import type { Order, ProductWithDetails } from "@shared/schema";
import { Link } from "wouter";

export default function BuyerDashboardPage() {
  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const { data: wishlist = [] } = useQuery<ProductWithDetails[]>({
    queryKey: ["/api/wishlist"],
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      pending: "secondary",
      paid: "default",
      shipped: "default",
      delivered: "outline",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-accent text-3xl font-bold mb-2" data-testid="text-dashboard-title">
          My Dashboard
        </h1>
        <p className="text-muted-foreground">Manage your orders and wishlist</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{orders.length}</p>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {orders.filter((o) => o.status === "pending").length}
              </p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {orders.filter((o) => o.status === "delivered").length}
              </p>
              <p className="text-sm text-muted-foreground">Delivered</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-pink-500/10 flex items-center justify-center">
              <Heart className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{wishlist.length}</p>
              <p className="text-sm text-muted-foreground">Wishlist Items</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-6">
          <div className="space-y-4">
            {orders.length === 0 ? (
              <Card className="p-12 text-center">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold text-lg mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
                <Button asChild>
                  <Link href="/products">Browse Products</Link>
                </Button>
              </Card>
            ) : (
              orders.map((order) => (
                <Card key={order.id} className="p-6" data-testid={`card-order-${order.id}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold">Order #{order.id.slice(0, 8)}</h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        GH₵{parseFloat(order.totalAmount).toFixed(2)}
                      </p>
                    </div>
                    <Button variant="outline" data-testid={`button-view-order-${order.id}`}>
                      View Details
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="wishlist" className="mt-6">
          {wishlist.length === 0 ? (
            <Card className="p-12 text-center">
              <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold text-lg mb-2">Your wishlist is empty</h3>
              <p className="text-muted-foreground mb-6">Save items you love for later</p>
              <Button asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {wishlist.map((product) => (
                <Card key={product.id} className="overflow-hidden group">
                  <Link href={`/product/${product.slug}`}>
                    <img
                      src={product.images[0] || "/placeholder-product.png"}
                      alt={product.name}
                      className="aspect-square w-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </Link>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{product.name}</h3>
                    <p className="text-2xl font-bold text-primary">
                      GH₵{parseFloat(product.price).toFixed(2)}
                    </p>
                    <Button className="w-full mt-4">Add to Cart</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
