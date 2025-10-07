import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { CreditCard, Smartphone, ShoppingBag } from "lucide-react";
import type { CartItemWithProduct } from "@shared/schema";

export default function CheckoutPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    momoNumber: "0242711858",
  });

  // Fetch cart items
  const { data: cartItems = [], isLoading } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart"],
    enabled: !!user,
  });

  // Initialize payment mutation
  const initializePayment = useMutation({
    mutationFn: async (orderData: any) => {
      const res = await apiRequest("POST", "/api/payments/initialize", orderData);
      return res.json();
    },
    onSuccess: (data: any) => {
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      }
    },
    onError: () => {
      toast({
        title: "Payment initialization failed",
        description: "Please try again",
        variant: "destructive",
      });
      setIsProcessing(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to checkout",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product?.price || "0",
        })),
        shippingAddress: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
        },
        paymentMethod,
        momoNumber: paymentMethod === "momo" ? formData.momoNumber : undefined,
      };

      await initializePayment.mutateAsync(orderData);
    } catch (error) {
      setIsProcessing(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.product?.price || "0");
    return sum + (price * item.quantity);
  }, 0);
  const shipping = 10;
  const total = subtotal + shipping;

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Please login to checkout</h1>
        <Button onClick={() => navigate("/login")}>Login</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Button onClick={() => navigate("/")}>Start Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-accent text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="md:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card className="p-6">
              <h2 className="font-semibold text-xl mb-6">Shipping Information</h2>
              <div className="grid gap-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      data-testid="input-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      data-testid="input-phone"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    data-testid="input-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    data-testid="input-address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                    data-testid="input-city"
                  />
                </div>
              </div>
            </Card>

            {/* Payment Method */}
            <Card className="p-6">
              <h2 className="font-semibold text-xl mb-6">Payment Method</h2>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover-elevate cursor-pointer">
                  <RadioGroupItem value="momo" id="momo" data-testid="radio-momo" />
                  <Label htmlFor="momo" className="flex items-center flex-1 cursor-pointer">
                    <Smartphone className="h-5 w-5 mr-3 text-green-600" />
                    <div>
                      <p className="font-medium">MTN Mobile Money</p>
                      <p className="text-sm text-muted-foreground">Pay with your mobile money account</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover-elevate cursor-pointer opacity-50">
                  <RadioGroupItem value="card" id="card" disabled />
                  <Label htmlFor="card" className="flex items-center flex-1 cursor-pointer">
                    <CreditCard className="h-5 w-5 mr-3" />
                    <div>
                      <p className="font-medium">Card Payment</p>
                      <p className="text-sm text-muted-foreground">Coming soon</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === "momo" && (
                <div className="mt-6 space-y-2">
                  <Label htmlFor="momoNumber">Mobile Money Number</Label>
                  <Input
                    id="momoNumber"
                    type="tel"
                    value={formData.momoNumber}
                    onChange={(e) => setFormData({ ...formData, momoNumber: e.target.value })}
                    placeholder="024XXXXXXX"
                    required
                    data-testid="input-momo-number"
                  />
                  <p className="text-sm text-muted-foreground">
                    You'll receive a prompt on your phone to authorize the payment
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="font-semibold text-xl mb-6">Order Summary</h2>
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

              <Button
                type="submit"
                className="w-full mt-6"
                size="lg"
                disabled={isProcessing}
                data-testid="button-place-order"
              >
                {isProcessing ? "Processing..." : "Place Order"}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                By placing your order, you agree to our Terms of Service and Privacy Policy
              </p>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
