import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import type { Category } from "@shared/schema";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const imageUrl = category.image || "/placeholder-category.png";

  return (
    <Link href={`/category/${category.slug}`}>
      <Card
        className="group relative overflow-hidden aspect-[4/3] hover-elevate transition-all duration-300"
        data-testid={`card-category-${category.id}`}
      >
        <img
          src={imageUrl}
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="font-accent text-2xl font-bold text-white" data-testid={`text-category-name-${category.id}`}>
            {category.name}
          </h3>
          {category.description && (
            <p className="text-white/90 text-sm mt-1 line-clamp-2">
              {category.description}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}
