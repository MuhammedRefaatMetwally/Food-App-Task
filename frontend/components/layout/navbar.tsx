'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Globe, User, LogOut, LayoutDashboard, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cart.store';
import { useAuth } from '@/hooks/use-auth';

export function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, isAdmin, logout, getUser } = useAuth();
  const itemCount = useCartStore((s) => s.itemCount());

  const switchLocale = () => {
    const next = locale === 'en' ? 'ar' : 'en';
    localStorage.setItem('lang', next);
    // swap locale prefix in the URL
    const newPath = pathname.replace(`/${locale}`, `/${next}`);
    router.push(newPath);
    router.refresh();
  };

  const user = getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2 font-bold text-xl text-orange-500">
          <UtensilsCrossed className="h-6 w-6" />
          FoodApp
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href={`/${locale}`} className="hover:text-orange-500 transition-colors">
            {t('menu')}
          </Link>
          {isLoggedIn() && (
            <Link href={`/${locale}/orders`} className="hover:text-orange-500 transition-colors">
              {t('orders')}
            </Link>
          )}
          {isAdmin() && (
            <Link href={`/${locale}/admin`} className="hover:text-orange-500 transition-colors">
              {t('admin')}
            </Link>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <Button variant="ghost" size="sm" onClick={switchLocale} className="gap-1">
            <Globe className="h-4 w-4" />
            {locale === 'en' ? 'عربي' : 'EN'}
          </Button>

          {/* Cart */}
          <Link href={`/${locale}/cart`}>
            <Button variant="ghost" size="sm" className="relative gap-1">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-orange-500 hover:bg-orange-500">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Auth */}
          {isLoggedIn() ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/orders`}>
                    <User className="h-4 w-4 mr-2" />
                    {t('orders')}
                  </Link>
                </DropdownMenuItem>
                {isAdmin() && (
                  <DropdownMenuItem asChild>
                    <Link href={`/${locale}/admin`}>
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      {t('admin')}
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-500">
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/${locale}/auth/login`}>{t('login')}</Link>
              </Button>
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600" asChild>
                <Link href={`/${locale}/auth/register`}>{t('register')}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}