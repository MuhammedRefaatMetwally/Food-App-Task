import { UtensilsCrossed } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function Footer() {
  return (
    <footer className="border-t bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-orange-500">
            <UtensilsCrossed className="h-5 w-5" />
            FoodApp
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FoodApp. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Fresh food, fast delivery 🚀
          </p>
        </div>
      </div>
    </footer>
  );
}