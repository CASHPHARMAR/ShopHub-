import type {
  User,
  InsertUser,
  Product,
  InsertProduct,
  Category,
  InsertCategory,
  Order,
  InsertOrder,
  CartItem,
  InsertCartItem,
  WishlistItem,
  InsertWishlistItem,
  Review,
  InsertReview,
  ProductWithDetails,
  CartItemWithProduct,
  ReviewWithUser,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Products
  getProducts(filters?: { categoryId?: string; sellerId?: string; isFeatured?: boolean }): Promise<ProductWithDetails[]>;
  getProductById(id: string): Promise<ProductWithDetails | undefined>;
  getProductBySlug(slug: string): Promise<ProductWithDetails | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Orders
  getOrders(userId?: string): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;

  // Cart
  getCartItems(userId: string): Promise<CartItemWithProduct[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;

  // Wishlist
  getWishlistItems(userId: string): Promise<WishlistItem[]>;
  addToWishlist(item: InsertWishlistItem): Promise<WishlistItem>;
  removeFromWishlist(id: string): Promise<boolean>;

  // Reviews
  getProductReviews(productId: string): Promise<ReviewWithUser[]>;
  createReview(review: InsertReview): Promise<Review>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private categories: Map<string, Category>;
  private orders: Map<string, Order>;
  private cartItems: Map<string, CartItem>;
  private wishlistItems: Map<string, WishlistItem>;
  private reviews: Map<string, Review>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.categories = new Map();
    this.orders = new Map();
    this.cartItems = new Map();
    this.wishlistItems = new Map();
    this.reviews = new Map();
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    return updated;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Products
  async getProducts(filters?: { categoryId?: string; sellerId?: string; isFeatured?: boolean }): Promise<ProductWithDetails[]> {
    let products = Array.from(this.products.values());

    if (filters?.categoryId) {
      products = products.filter((p) => p.categoryId === filters.categoryId);
    }
    if (filters?.sellerId) {
      products = products.filter((p) => p.sellerId === filters.sellerId);
    }
    if (filters?.isFeatured !== undefined) {
      products = products.filter((p) => p.isFeatured === filters.isFeatured);
    }

    return products.map((p) => ({
      ...p,
      seller: this.users.get(p.sellerId),
      category: p.categoryId ? this.categories.get(p.categoryId) : undefined,
    }));
  }

  async getProductById(id: string): Promise<ProductWithDetails | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    return {
      ...product,
      seller: this.users.get(product.sellerId),
      category: product.categoryId ? this.categories.get(product.categoryId) : undefined,
    };
  }

  async getProductBySlug(slug: string): Promise<ProductWithDetails | undefined> {
    const product = Array.from(this.products.values()).find((p) => p.slug === slug);
    if (!product) return undefined;
    return {
      ...product,
      seller: this.users.get(product.sellerId),
      category: product.categoryId ? this.categories.get(product.categoryId) : undefined,
    };
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = {
      ...insertProduct,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    const updated = { ...product, ...updates, updatedAt: new Date() };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find((c) => c.slug === slug);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = {
      ...insertCategory,
      id,
      createdAt: new Date(),
    };
    this.categories.set(id, category);
    return category;
  }

  // Orders
  async getOrders(userId?: string): Promise<Order[]> {
    let orders = Array.from(this.orders.values());
    if (userId) {
      orders = orders.filter((o) => o.userId === userId);
    }
    return orders;
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      ...insertOrder,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    const updated = { ...order, status, updatedAt: new Date() };
    this.orders.set(id, updated);
    return updated;
  }

  // Cart
  async getCartItems(userId: string): Promise<CartItemWithProduct[]> {
    const items = Array.from(this.cartItems.values()).filter((item) => item.userId === userId);
    return items.map((item) => ({
      ...item,
      product: this.products.get(item.productId)!,
    }));
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    const id = randomUUID();
    const item: CartItem = {
      ...insertItem,
      id,
      createdAt: new Date(),
    };
    this.cartItems.set(id, item);
    return item;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;
    const updated = { ...item, quantity };
    this.cartItems.set(id, updated);
    return updated;
  }

  async removeFromCart(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  // Wishlist
  async getWishlistItems(userId: string): Promise<WishlistItem[]> {
    return Array.from(this.wishlistItems.values()).filter((item) => item.userId === userId);
  }

  async addToWishlist(insertItem: InsertWishlistItem): Promise<WishlistItem> {
    const id = randomUUID();
    const item: WishlistItem = {
      ...insertItem,
      id,
      createdAt: new Date(),
    };
    this.wishlistItems.set(id, item);
    return item;
  }

  async removeFromWishlist(id: string): Promise<boolean> {
    return this.wishlistItems.delete(id);
  }

  // Reviews
  async getProductReviews(productId: string): Promise<ReviewWithUser[]> {
    const reviews = Array.from(this.reviews.values()).filter((r) => r.productId === productId);
    return reviews.map((review) => ({
      ...review,
      user: this.users.get(review.userId)!,
    }));
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const review: Review = {
      ...insertReview,
      id,
      createdAt: new Date(),
    };
    this.reviews.set(id, review);
    return review;
  }
}

// Database Storage using Drizzle ORM
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { users, products, categories, orders, cartItems, wishlistItems, reviews } from "@shared/schema";

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Products
  async getProducts(filters?: { categoryId?: string; sellerId?: string; isFeatured?: boolean }): Promise<ProductWithDetails[]> {
    const conditions = [];
    
    if (filters?.categoryId) conditions.push(eq(products.categoryId, filters.categoryId));
    if (filters?.sellerId) conditions.push(eq(products.sellerId, filters.sellerId));
    if (filters?.isFeatured !== undefined) conditions.push(eq(products.isFeatured, filters.isFeatured));

    // Fetch products with related data using joins
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    const productsWithRelations = await db.query.products.findMany({
      where: whereClause,
      with: {
        seller: true,
        category: true,
      },
    });

    // Get review stats separately using aggregation
    const productsWithDetails = await Promise.all(
      productsWithRelations.map(async (product) => {
        const productReviews = await db.select({
          rating: reviews.rating
        })
        .from(reviews)
        .where(eq(reviews.productId, product.id));
        
        const averageRating = productReviews.length > 0
          ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
          : undefined;

        return {
          ...product,
          seller: product.seller,
          category: product.category,
          averageRating,
          reviewCount: productReviews.length,
        };
      })
    );

    return productsWithDetails;
  }

  async getProductById(id: string): Promise<ProductWithDetails | undefined> {
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        seller: true,
        category: true,
      },
    });
    
    if (!product) return undefined;

    const productReviews = await db.select({
      rating: reviews.rating
    })
    .from(reviews)
    .where(eq(reviews.productId, product.id));
    
    const averageRating = productReviews.length > 0
      ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
      : undefined;

    return {
      ...product,
      seller: product.seller,
      category: product.category,
      averageRating,
      reviewCount: productReviews.length,
    };
  }

  async getProductBySlug(slug: string): Promise<ProductWithDetails | undefined> {
    const product = await db.query.products.findFirst({
      where: eq(products.slug, slug),
      with: {
        seller: true,
        category: true,
      },
    });
    
    if (!product) return undefined;

    const productReviews = await db.select({
      rating: reviews.rating
    })
    .from(reviews)
    .where(eq(reviews.productId, product.id));
    
    const averageRating = productReviews.length > 0
      ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
      : undefined;

    return {
      ...product,
      seller: product.seller,
      category: product.category,
      averageRating,
      reviewCount: productReviews.length,
    };
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    const [product] = await db.update(products)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return product || undefined;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category || undefined;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }

  // Orders
  async getOrders(userId?: string): Promise<Order[]> {
    if (userId) {
      return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
    }
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(insertOrder).returning();
    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const [order] = await db.update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return order || undefined;
  }

  // Cart
  async getCartItems(userId: string): Promise<CartItemWithProduct[]> {
    const items = await db.select().from(cartItems).where(eq(cartItems.userId, userId));

    const itemsWithProducts = await Promise.all(
      items.map(async (item) => {
        const product = await this.getProductById(item.productId);
        return {
          ...item,
          product: product!,
        };
      })
    );

    return itemsWithProducts;
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    const [item] = await db.insert(cartItems).values(insertItem).returning();
    return item;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const [item] = await db.update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return item || undefined;
  }

  async removeFromCart(id: string): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Wishlist
  async getWishlistItems(userId: string): Promise<WishlistItem[]> {
    return await db.select().from(wishlistItems).where(eq(wishlistItems.userId, userId));
  }

  async addToWishlist(insertItem: InsertWishlistItem): Promise<WishlistItem> {
    const [item] = await db.insert(wishlistItems).values(insertItem).returning();
    return item;
  }

  async removeFromWishlist(id: string): Promise<boolean> {
    const result = await db.delete(wishlistItems).where(eq(wishlistItems.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Reviews
  async getProductReviews(productId: string): Promise<ReviewWithUser[]> {
    const productReviews = await db.select().from(reviews).where(eq(reviews.productId, productId));

    const reviewsWithUsers = await Promise.all(
      productReviews.map(async (review) => {
        const [user] = await db.select().from(users).where(eq(users.id, review.userId));
        return {
          ...review,
          user: user!,
        };
      })
    );

    return reviewsWithUsers;
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(insertReview).returning();
    return review;
  }
}

export const storage = new DatabaseStorage();
