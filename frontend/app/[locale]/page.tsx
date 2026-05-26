'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Sparkles, Flame, Clock } from 'lucide-react';
import { ProductCard } from '@/components/menu/product-card';
import { CategoryFilter } from '@/components/menu/category-filter';
import { Skeleton } from '@/components/ui/skeleton';
import { useProducts, useCategories } from '@/hooks/use-products';

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden bg-card border border-border/60">
          <div className="h-52 shimmer" />
          <div className="p-4 space-y-3">
            <div className="shimmer h-4 w-3/4 rounded-full" />
            <div className="shimmer h-3 w-full rounded-full" />
            <div className="shimmer h-3 w-2/3 rounded-full" />
            <div className="flex justify-between items-center pt-1">
              <div className="shimmer h-6 w-16 rounded-full" />
              <div className="shimmer h-8 w-24 rounded-full" />
            </div>
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
    <div className="mesh-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-14"
        >
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 rounded-full px-4 py-1.5 text-sm font-medium mb-5"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Fresh & Fast Delivery
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {t('title').split(' ').slice(0, 2).join(' ')}
            </span>{' '}
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              {t('title').split(' ').slice(2).join(' ')}
            </span>
          </h1>

          <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
            {t('subtitle')}
          </p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-8 text-sm"
          >
            {[
              { icon: Flame, label: 'Hot Deals', value: '20+ items' },
              { icon: Clock, label: 'Delivery', value: '30 min' },
              { icon: Sparkles, label: 'Fresh', value: 'Daily' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2 text-muted-foreground">
                <Icon className="h-4 w-4 text-orange-500" />
                <span>{value} {label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mb-8"
        >
          <CategoryFilter
            categories={categories ?? []}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
            isLoading={loadingCategories}
          />
        </motion.div>

        {/* Products */}
        {loadingProducts ? (
          <ProductGridSkeleton />
        ) : products?.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No products found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products?.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}