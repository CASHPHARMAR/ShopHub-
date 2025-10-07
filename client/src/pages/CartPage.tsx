import { Link } from "wouter";
import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import type { CartItemWithProduct } from "@shared/schema";

export default function CartPage() {
  const { data: cartItems = [], isLoading } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart"],
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + shipping;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-muted rounded-lg" />
              ))}
            </div>
            <div className="h-64 bg-muted rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="text-muted-foreground mb-6">
            Add some products to your cart to continue shopping
          </p>
          <Button asChild data-testid="button-continue-shopping">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-accent text-3xl font-bold mb-8" data-testid="text-cart-title">
        Shopping Cart ({cartItems.length} items)
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id} className="p-4" data-testid={`card-cart-item-${item.id}`}>
              <div className="flex gap-4">
                <img
                  src={item.product.images[0] || "/placeholder-product.png"}
                  alt={item.product.name}
                  className="h-24 w-24 rounded-lg object-cover"
                  data-testid={`img-cart-item-${item.id}`}
                />
                <div className="flex-1">
                  <Link href={`/product/${item.product.slug}`}>
                    <h3 className="font-semibold hover:text-primary transition-colors" data-testid={`text-cart-item-name-${item.id}`}>
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1">
                    GH₵{parseFloat(item.product.price).toFixed(2)} each
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        data-testid={`button-decrease-${item.id}`}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center text-sm" data-testid={`text-quantity-${item.id}`}>
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        data-testid={`button-increase-${item.id}`}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      data-testid={`button-remove-${item.id}`}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg" data-testid={`text-item-total-${item.id}`}>
                    GH₵{(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="p-6 sticky top-24">
            <h3 className="font-accent text-xl font-bold mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium" data-testid="text-subtotal">
                  GH₵{subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium" data-testid="text-shipping">
                  GH₵{shipping.toFixed(2)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-bold text-2xl text-primary" data-testid="text-total">
                  GH₵{total.toFixed(2)}
                </span>
              </div>
            </div>
            <Button className="w-full mt-6" size="lg" asChild data-testid="button-checkout">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
            <Button variant="outline" className="w-full mt-3" asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
