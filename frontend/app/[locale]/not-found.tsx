import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="mb-6 relative">
        <p className="text-[120px] font-black leading-none text-orange-500/10 dark:text-orange-500/15 select-none">
          404
        </p>
        <p className="absolute inset-0 flex items-center justify-center text-[80px] font-black leading-none text-orange-500">
          404
        </p>
      </div>
      <h2 className="text-2xl font-bold mb-2 text-foreground">
        Page not found
      </h2>
      <p className="text-muted-foreground mb-8 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button
        asChild
        className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 h-11 px-8 text-sm font-medium transition-colors"
      >
        <Link href="/en">Back to Menu</Link>
      </Button>
    </div>
  );
}