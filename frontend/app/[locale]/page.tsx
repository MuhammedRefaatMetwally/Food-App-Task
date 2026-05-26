'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ProductCard } from '@/components/menu/product-card';
import { CategoryFilter } from '@/components/menu/category-filter';
import { Skeleton } from '@/components/ui/skeleton';
import { useProducts, useCategories } from '@/hooks/use-products';

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-xl overflow-hidden shadow-sm bg-white">
          <Skeleton className="h-48 w-full" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-8 w-1/3 mt-2" />
          </div>
          <div className="px-4 pb-4">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const t = useTranslations('home');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  const { data: products, isLoading: loadingProducts } = useProducts(selectedCategory);
  const { data: categories, isLoading: loadingCategories } = useCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">{t('title')}</h1>
        <p className="text-muted-foreground text-lg">{t('subtitle')}</p>
      </div>

      {/* Category filter */}
      <div className="mb-8">
        <CategoryFilter
          categories={categories ?? []}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          isLoading={loadingCategories}
        />
      </div>

      {/* Product grid */}
      {loadingProducts ? (
        <ProductGridSkeleton />
      ) : products?.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">No products found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}