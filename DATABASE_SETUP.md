# Database Setup - SHOPHUB

This project uses **PostgreSQL** with **Drizzle ORM** for persistent data storage.

## Overview

The application is configured to use Replit's built-in PostgreSQL database, which provides:
- ✅ Persistent data storage
- ✅ Automatic backups
- ✅ Built-in database management tools
- ✅ No external setup required

## Database Schema

The application uses the following tables:

### users
- `id` (UUID, Primary Key)
- `email` (unique)
- `password` (hashed)
- `name`
- `role` (buyer, seller, admin)
- `firebaseUid` (optional, for legacy migration)
- `shopName` (for sellers)
- `shopLogo` (for sellers)
- `createdAt`

### categories
- `id` (UUID, Primary Key)
- `name` (unique)
- `slug` (unique)
- `image`
- `description`
- `createdAt`

### products
- `id` (UUID, Primary Key)
- `sellerId` (Foreign Key to users)
- `categoryId` (Foreign Key to categories)
- `name`
- `slug` (unique)
- `shortDescription`
- `longDescription`
- `price`
- `compareAtPrice`
- `images` (array)
- `stock`
- `isAiGenerated`
- `isFeatured`
- `status` (active, draft, archived)
- `createdAt`
- `updatedAt`

### reviews
- `id` (UUID, Primary Key)
- `productId` (Foreign Key to products)
- `userId` (Foreign Key to users)
- `rating` (1-5)
- `comment`
- `createdAt`

### orders
- `id` (UUID, Primary Key)
- `userId` (Foreign Key to users)
- `status` (pending, paid, shipped, delivered, cancelled)
- `totalAmount`
- `paymentReference`
- `paymentStatus`
- `shippingAddress` (JSON)
- `items` (JSON array)
- `createdAt`
- `updatedAt`

### cart_items
- `id` (UUID, Primary Key)
- `userId` (Foreign Key to users)
- `productId` (Foreign Key to products)
- `quantity`
- `createdAt`

### wishlist_items
- `id` (UUID, Primary Key)
- `userId` (Foreign Key to users)
- `productId` (Foreign Key to products)
- `createdAt`

## Database Migrations

The project uses Drizzle Kit for database migrations:

```bash
# Push schema changes to database
npm run db:push

# Force push (use if you encounter conflicts)
npm run db:push --force
```

**Important:** Never manually write SQL migrations. Always use `npm run db:push` to sync schema changes.

## Seed Data

The application automatically seeds the database on first run with:

### Test Accounts
- **Admin:** admin@shophub.com / admin123
- **Seller:** seller@shophub.com / seller123
- **Buyer:** buyer@shophub.com / buyer123

### Sample Data
- 4 product categories (Electronics, Fashion, Home & Living, Beauty & Health)
- 6 sample products from various categories
- All products include images, descriptions, and pricing

## Database Access

### Via Replit UI
1. Click on "Database" in the left sidebar
2. View/edit data directly in the UI
3. Run SQL queries in the SQL editor

### Via Code
```typescript
import { db } from "./server/db";
import { users, products } from "@shared/schema";
import { eq } from "drizzle-orm";

// Query example
const allUsers = await db.select().from(users);
const product = await db.select().from(products).where(eq(products.id, productId));
```

## Environment Variables

The following database-related environment variables are automatically set by Replit:
- `DATABASE_URL` - PostgreSQL connection string
- `PGHOST` - Database host
- `PGPORT` - Database port
- `PGDATABASE` - Database name
- `PGUSER` - Database user
- `PGPASSWORD` - Database password

## Storage Implementation

The project uses a `DatabaseStorage` class (in `server/storage.ts`) that implements the `IStorage` interface. This provides:

- Type-safe database operations
- Automatic relationship loading
- Transaction support through Drizzle ORM
- Efficient querying with proper indexing

## Backup & Restore

Replit automatically backs up your database. To manually backup:

1. Go to Database pane in Replit
2. Click "Export" to download a SQL dump
3. To restore, use "Import" in the Database pane

## Troubleshooting

### Database Connection Errors
- Ensure `DATABASE_URL` is set in environment variables
- Restart the application to reconnect
- Check database status in Replit UI

### Migration Errors
- Use `npm run db:push --force` to force sync
- Never change ID column types (serial ↔ varchar)
- Always preserve existing schema structure

### Data Not Persisting
- Verify you're using `DatabaseStorage` not `MemStorage`
- Check `server/storage.ts` exports `new DatabaseStorage()`
- Ensure transactions are properly committed

## Development Guidelines

1. **Schema Changes:** Always update `shared/schema.ts` first
2. **Storage Methods:** Add new methods to `IStorage` interface
3. **Migration:** Run `npm run db:push` after schema changes
4. **Testing:** Use test accounts for development
5. **Production:** Database automatically scales with your app

## Additional Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Replit Database Guide](https://docs.replit.com/hosting/databases/postgresql)
