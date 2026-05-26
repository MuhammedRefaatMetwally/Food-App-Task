import { UtensilsCrossed, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-1.5 rounded-lg">
              <UtensilsCrossed className="h-4 w-4 text-white" />
            </div>
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              FoodApp
            </span>
          </div>

          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            Made with <Heart className="h-3.5 w-3.5 text-orange-500 fill-orange-500" /> for food lovers
          </p>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FoodApp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}