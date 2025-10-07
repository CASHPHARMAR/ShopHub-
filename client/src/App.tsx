import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/providers/AuthContext";
import { Header } from "@/components/Header";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import ProductDetailsPage from "@/pages/ProductDetailsPage";
import SearchResultsPage from "@/pages/SearchResultsPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import BuyerDashboardPage from "@/pages/BuyerDashboardPage";
import SellerDashboardPage from "@/pages/SellerDashboardPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";

function Router() {
  useAnalytics();
  
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-4rem)]">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/product/:slug" component={ProductDetailsPage} />
          <Route path="/search" component={SearchResultsPage} />
          <Route path="/cart" component={CartPage} />
          <Route path="/checkout" component={CheckoutPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/buyer/dashboard" component={BuyerDashboardPage} />
          <Route path="/seller/dashboard" component={SellerDashboardPage} />
          <Route path="/admin/dashboard" component={AdminDashboardPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </>
  );
}

export default function App() {
  useEffect(() => {
    if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
      initGA();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <Router />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
