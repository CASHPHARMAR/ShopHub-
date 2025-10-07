import { storage } from "./storage";
import { hashPassword } from "./lib/auth";

export async function seedData() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await hashPassword("admin123");
  const admin = await storage.createUser({
    email: "admin@shophub.com",
    password: adminPassword,
    name: "Admin User",
    role: "admin",
  });

  // Create seller user
  const sellerPassword = await hashPassword("seller123");
  const seller = await storage.createUser({
    email: "seller@shophub.com",
    password: sellerPassword,
    name: "John's Electronics",
    role: "seller",
    shopName: "John's Electronics",
  });

  // Create buyer user
  const buyerPassword = await hashPassword("buyer123");
  const buyer = await storage.createUser({
    email: "buyer@shophub.com",
    password: buyerPassword,
    name: "Jane Doe",
    role: "buyer",
  });

  // Create categories
  const electronics = await storage.createCategory({
    name: "Electronics",
    slug: "electronics",
    description: "Latest gadgets and electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=600&fit=crop",
  });

  const fashion = await storage.createCategory({
    name: "Fashion",
    slug: "fashion",
    description: "Trendy clothing and accessories",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop",
  });

  const home = await storage.createCategory({
    name: "Home & Living",
    slug: "home-living",
    description: "Everything for your home",
    image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&h=600&fit=crop",
  });

  const beauty = await storage.createCategory({
    name: "Beauty & Health",
    slug: "beauty-health",
    description: "Beauty and wellness products",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=600&fit=crop",
  });

  // Create sample products
  const products = [
    {
      sellerId: seller.id,
      name: "Wireless Noise Cancelling Headphones",
      slug: "wireless-noise-cancelling-headphones",
      shortDescription: "Premium wireless headphones with active noise cancellation",
      longDescription: "Experience crystal-clear audio with our premium wireless headphones featuring advanced active noise cancellation technology. Perfect for music lovers, travelers, and professionals who demand the best sound quality.",
      price: "299.99",
      compareAtPrice: "399.99",
      categoryId: electronics.id,
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
      ],
      stock: 50,
      isFeatured: true,
      status: "active",
    },
    {
      sellerId: seller.id,
      name: "Smart Watch Pro",
      slug: "smart-watch-pro",
      shortDescription: "Advanced fitness tracking and notifications on your wrist",
      longDescription: "Stay connected and healthy with our Smart Watch Pro. Track your fitness goals, receive notifications, and monitor your health metrics all day long.",
      price: "249.99",
      categoryId: electronics.id,
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop",
      ],
      stock: 30,
      isFeatured: true,
      status: "active",
    },
    {
      sellerId: seller.id,
      name: "Designer Leather Backpack",
      slug: "designer-leather-backpack",
      shortDescription: "Handcrafted genuine leather backpack for professionals",
      longDescription: "Elevate your style with this premium handcrafted leather backpack. Perfect blend of sophistication and functionality for the modern professional.",
      price: "189.99",
      compareAtPrice: "249.99",
      categoryId: fashion.id,
      images: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop",
      ],
      stock: 20,
      isFeatured: true,
      status: "active",
    },
    {
      sellerId: seller.id,
      name: "Minimalist Desk Lamp",
      slug: "minimalist-desk-lamp",
      shortDescription: "LED desk lamp with adjustable brightness and color temperature",
      longDescription: "Illuminate your workspace with our sleek minimalist desk lamp. Features adjustable brightness, color temperature control, and energy-efficient LED technology.",
      price: "79.99",
      categoryId: home.id,
      images: [
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop",
      ],
      stock: 45,
      isFeatured: true,
      status: "active",
    },
    {
      sellerId: seller.id,
      name: "Organic Skincare Set",
      slug: "organic-skincare-set",
      shortDescription: "Complete organic skincare routine for glowing skin",
      longDescription: "Achieve radiant, healthy skin with our complete organic skincare set. Made from natural ingredients, free from harsh chemicals.",
      price: "129.99",
      categoryId: beauty.id,
      images: [
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=800&fit=crop",
      ],
      stock: 35,
      status: "active",
    },
    {
      sellerId: seller.id,
      name: "Portable Bluetooth Speaker",
      slug: "portable-bluetooth-speaker",
      shortDescription: "Waterproof speaker with 360° sound and 24-hour battery",
      longDescription: "Take your music anywhere with our rugged portable speaker. Featuring 360° sound, waterproof design, and an impressive 24-hour battery life.",
      price: "89.99",
      categoryId: electronics.id,
      images: [
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop",
      ],
      stock: 60,
      status: "active",
    },
  ];

  for (const product of products) {
    await storage.createProduct(product);
  }

  console.log("✅ Database seeded successfully!");
  console.log("\nTest Accounts:");
  console.log("- Admin: admin@shophub.com / admin123");
  console.log("- Seller: seller@shophub.com / seller123");
  console.log("- Buyer: buyer@shophub.com / buyer123");
}
