'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Plus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useCartStore } from '@/store/cart.store';
import { Product } from '@/types';
import { toast } from 'sonner';

export function ProductCard({ product }: { product: Product }) {
  const t = useTranslations('product');
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = () => {
    addItem(product);
    toast.success(`${product.name} added to cart!`, { icon: '🛒' });
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!product.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive">{t('unavailable')}</Badge>
          </div>
        )}
        <Badge className="absolute top-2 left-2 bg-orange-500 hover:bg-orange-500">
          {product.category?.name}
        </Badge>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-base leading-tight mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {product.desc}
        </p>
        <p className="text-xl font-bold text-orange-500">
          ${product.price.toFixed(2)}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-orange-500 hover:bg-orange-600 gap-2"
          onClick={handleAdd}
          disabled={!product.available}
        >
          <Plus className="h-4 w-4" />
          {t('addToCart')}
        </Button>
      </CardFooter>
    </Card>
  );
}