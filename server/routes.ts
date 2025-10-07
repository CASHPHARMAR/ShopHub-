import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { hashPassword, comparePassword, generateToken, getUserFromToken } from "./lib/auth";
import { generateProductDescription, intelligentSearch, recommendProducts, summarizeReviews } from "./lib/gemini";
import { insertUserSchema, insertProductSchema, insertOrderSchema, insertCartItemSchema, insertWishlistItemSchema, insertReviewSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware to get current user
  const getCurrentUser = async (req: any) => {
    const user = getUserFromToken(req.headers.authorization);
    if (user) {
      return await storage.getUser(user.id);
    }
    return null;
  };

  // ===== Authentication Routes =====
  
  // Register
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      
      // Check if user exists
      const existing = await storage.getUserByEmail(data.email!);
      if (existing) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Hash password
      const hashedPassword = await hashPassword(data.password!);
      const user = await storage.createUser({
        ...data,
        password: hashedPassword,
      });

      const token = generateToken(user);
      res.json({ user: { ...user, password: undefined }, token });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);

      if (!user || !user.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const valid = await comparePassword(password, user.password);
      if (!valid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = generateToken(user);
      res.json({ user: { ...user, password: undefined }, token });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get current user
  app.get("/api/auth/me", async (req, res) => {
    const user = await getCurrentUser(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.json({ ...user, password: undefined });
  });

  // ===== Product Routes =====
  
  // Get all products
  app.get("/api/products", async (req, res) => {
    const { categoryId, sellerId, featured } = req.query;
    const filters: any = {};
    
    if (categoryId) filters.categoryId = categoryId as string;
    if (sellerId) filters.sellerId = sellerId as string;
    if (featured !== undefined) filters.isFeatured = featured === "true";
    
    const products = await storage.getProducts(filters);
    res.json(products);
  });

  // Get featured products
  app.get("/api/products/featured", async (req, res) => {
    const products = await storage.getProducts({ isFeatured: true });
    res.json(products);
  });

  // Get product by slug
  app.get("/api/products/:slug", async (req, res) => {
    const product = await storage.getProductBySlug(req.params.slug);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  });

  // Create product (sellers only)
  app.post("/api/products", async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      if (!user || (user.role !== "seller" && user.role !== "admin")) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const data = insertProductSchema.parse(req.body);
      const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      const product = await storage.createProduct({
        ...data,
        sellerId: user.id,
        slug: `${slug}-${Date.now()}`,
      });

      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Update product
  app.patch("/api/products/:id", async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const product = await storage.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.sellerId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }

      const updated = await storage.updateProduct(req.params.id, req.body);
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Delete product
  app.delete("/api/products/:id", async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const product = await storage.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.sellerId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }

      await storage.deleteProduct(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ===== AI Routes =====
  
  // Generate product description
  app.post("/api/ai/generate-description", async (req, res) => {
    try {
      const { productName, category } = req.body;
      const description = await generateProductDescription(productName, category);
      res.json({ description });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Intelligent search
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Query required" });
      }

      const allProducts = await storage.getProducts();
      const results = await intelligentSearch(query, allProducts);
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // AI Search (alias for intelligent search)
  app.get("/api/ai/search", async (req, res) => {
    try {
      const query = req.query.query as string;
      if (!query) {
        return res.status(400).json({ message: "Query required" });
      }

      const allProducts = await storage.getProducts();
      const results = await intelligentSearch(query, allProducts);
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get product recommendations
  app.get("/api/products/:slug/recommendations", async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const allProducts = await storage.getProducts();
      const recommendations = await recommendProducts(product.name, allProducts);
      res.json(recommendations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ===== Review Routes =====
  
  // Get product reviews
  app.get("/api/products/:slug/reviews", async (req, res) => {
    const product = await storage.getProductBySlug(req.params.slug);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const reviews = await storage.getProductReviews(product.id);
    res.json(reviews);
  });

  // Add review
  app.post("/api/reviews", async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const data = insertReviewSchema.parse({ ...req.body, userId: user.id });
      const review = await storage.createReview(data);
      res.json(review);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Summarize reviews
  app.get("/api/products/:slug/reviews/summary", async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const reviews = await storage.getProductReviews(product.id);
      const summary = await summarizeReviews(reviews);
      res.json(summary);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ===== Category Routes =====
  
  app.get("/api/categories", async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  // ===== Cart Routes =====
  
  // Get cart items
  app.get("/api/cart", async (req, res) => {
    const user = await getCurrentUser(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const items = await storage.getCartItems(user.id);
    res.json(items);
  });

  // Add to cart
  app.post("/api/cart", async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const data = insertCartItemSchema.parse({ ...req.body, userId: user.id });
      const item = await storage.addToCart(data);
      res.json(item);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Update cart item
  app.patch("/api/cart/:id", async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Verify ownership
      const cartItems = await storage.getCartItems(user.id);
      const item = cartItems.find(i => i.id === req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      const { quantity } = req.body;
      const updated = await storage.updateCartItem(req.params.id, quantity);
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Remove from cart
  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Verify ownership
      const cartItems = await storage.getCartItems(user.id);
      const item = cartItems.find(i => i.id === req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      await storage.removeFromCart(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ===== Wishlist Routes =====
  
  // Get wishlist
  app.get("/api/wishlist", async (req, res) => {
    const user = await getCurrentUser(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const items = await storage.getWishlistItems(user.id);
    const products = await Promise.all(
      items.map(item => storage.getProductById(item.productId))
    );
    res.json(products.filter(Boolean));
  });

  // Add to wishlist
  app.post("/api/wishlist", async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const data = insertWishlistItemSchema.parse({ ...req.body, userId: user.id });
      const item = await storage.addToWishlist(data);
      res.json(item);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Remove from wishlist
  app.delete("/api/wishlist/:id", async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Verify ownership
      const wishlistItems = await storage.getWishlistItems(user.id);
      const item = wishlistItems.find(i => i.id === req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Wishlist item not found" });
      }

      await storage.removeFromWishlist(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ===== Order Routes =====
  
  // Get orders
  app.get("/api/orders", async (req, res) => {
    const user = await getCurrentUser(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const orders = await storage.getOrders(user.id);
    res.json(orders);
  });

  // Create order
  app.post("/api/orders", async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const data = insertOrderSchema.parse({ ...req.body, userId: user.id });
      const order = await storage.createOrder(data);
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Update order status
  app.patch("/api/orders/:id/status", async (req, res) => {
    const { status } = req.body;
    const order = await storage.updateOrderStatus(req.params.id, status);
    res.json(order);
  });

  // ===== Seller Routes =====
  
  // Get seller products
  app.get("/api/seller/products", async (req, res) => {
    const user = await getCurrentUser(req);
    if (!user || user.role !== "seller") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const products = await storage.getProducts({ sellerId: user.id });
    res.json(products);
  });

  // Get seller orders
  app.get("/api/seller/orders", async (req, res) => {
    const user = await getCurrentUser(req);
    if (!user || user.role !== "seller") {
      return res.status(403).json({ message: "Forbidden" });
    }

    // TODO: Filter orders by seller's products
    const orders = await storage.getOrders();
    res.json(orders);
  });

  // ===== Admin Routes =====
  
  // Get all users
  app.get("/api/admin/users", async (req, res) => {
    const user = await getCurrentUser(req);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const users = await storage.getAllUsers();
    res.json(users.map(u => ({ ...u, password: undefined })));
  });

  // Get all products (admin)
  app.get("/api/admin/products", async (req, res) => {
    const user = await getCurrentUser(req);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const products = await storage.getProducts();
    res.json(products);
  });

  // Get all orders (admin)
  app.get("/api/admin/orders", async (req, res) => {
    const user = await getCurrentUser(req);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const orders = await storage.getOrders();
    res.json(orders);
  });

  // ===== Payment Routes =====
  
  // Initialize Paystack payment
  app.post("/api/payments/initialize", async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { items, shippingAddress, paymentMethod, momoNumber } = req.body;

      // Calculate total amount
      const amount = items.reduce((sum: number, item: any) => {
        return sum + (parseFloat(item.price) * item.quantity);
      }, 0);

      // Add shipping
      const totalAmount = amount + 10; // $10 shipping

      // Create order first
      const order = await storage.createOrder({
        buyerId: user.id,
        items,
        totalAmount: totalAmount.toString(),
        status: "pending",
        shippingAddress: JSON.stringify(shippingAddress),
        paymentMethod,
      });

      // In a real implementation, initialize Paystack here
      // For now, return a mock authorization URL
      const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
      
      if (!paystackSecretKey) {
        // Mock response for development
        return res.json({
          authorizationUrl: `/payment-success?reference=${order.id}`,
          reference: order.id,
          orderId: order.id,
        });
      }

      // Real Paystack implementation would go here
      // const response = await fetch('https://api.paystack.co/transaction/initialize', {
      //   method: 'POST',
      //   headers: {
      //     Authorization: `Bearer ${paystackSecretKey}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     email: user.email,
      //     amount: totalAmount * 100, // Paystack uses kobo
      //     channels: paymentMethod === 'momo' ? ['mobile_money'] : ['card'],
      //     metadata: {
      //       orderId: order.id,
      //       momoNumber: momoNumber,
      //     },
      //   }),
      // });

      res.json({
        authorizationUrl: `/buyer/dashboard?order=${order.id}`,
        reference: order.id,
        orderId: order.id,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Verify payment
  app.get("/api/payments/verify/:reference", async (req, res) => {
    try {
      const { reference } = req.params;
      
      // In real implementation, verify with Paystack
      // For now, just update order status
      await storage.updateOrderStatus(reference, "paid");
      
      res.json({ 
        success: true, 
        message: "Payment verified",
        orderId: reference,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
