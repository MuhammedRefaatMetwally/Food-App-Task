'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ShoppingCart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cart.store';
import { Product } from '@/types';
import { toast } from 'sonner';

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const t = useTranslations('product');
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = () => {
    addItem(product);
    toast.success(`Added to cart!`, {
      description: product.name,
      icon: '🛒',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <div className="rounded-2xl overflow-hidden bg-card border border-border/60 hover:border-orange-300/60 dark:hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300">
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <Badge className="bg-orange-500/90 hover:bg-orange-500 text-white border-0 backdrop-blur-sm text-xs shadow-md">
              {product.category?.name}
            </Badge>
            {!product.available && (
              <Badge variant="destructive" className="backdrop-blur-sm">
                {t('unavailable')}
              </Badge>
            )}
          </div>

          {/* Quick add button on hover */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            <Button
              size="icon"
              onClick={handleAdd}
              disabled={!product.available}
              className="h-9 w-9 rounded-full bg-white text-orange-500 hover:bg-orange-500 hover:text-white shadow-lg transition-colors duration-200"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-base leading-tight line-clamp-1 group-hover:text-orange-500 transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-0.5 text-yellow-400 flex-shrink-0">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="text-xs text-muted-foreground font-medium">4.8</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
            {product.desc}
          </p>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-orange-500">${product.price.toFixed(2)}</span>
            </div>
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={!product.available}
              className="rounded-full bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/30 gap-1.5 px-4 transition-all duration-200 hover:shadow-orange-500/40 hover:scale-105 active:scale-95"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              {t('addToCart')}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}