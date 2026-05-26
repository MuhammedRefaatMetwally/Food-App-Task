'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Category } from '@/types';

interface Props {
  categories: Category[];
  selected: string | undefined;
  onSelect: (id: string | undefined) => void;
  isLoading: boolean;
}

export function CategoryFilter({ categories, selected, onSelect, isLoading }: Props) {
  const t = useTranslations('home');

  if (isLoading) {
    return (
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 flex-wrap">
      <Button
        variant={!selected ? 'default' : 'outline'}
        size="sm"
        className={`rounded-full ${!selected ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
        onClick={() => onSelect(undefined)}
      >
        {t('allCategories')}
      </Button>
      {categories.map((cat) => (
        <Button
          key={cat.id}
          variant={selected === cat.id ? 'default' : 'outline'}
          size="sm"
          className={`rounded-full ${selected === cat.id ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
          onClick={() => onSelect(cat.id)}
        >
          {cat.name}
        </Button>
      ))}
    </div>
  );
}