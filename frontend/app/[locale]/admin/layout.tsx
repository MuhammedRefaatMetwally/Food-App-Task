'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { LayoutDashboard, Package, ShoppingBag, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isAdmin } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoggedIn() || !isAdmin()) {
      router.replace(`/${locale}/auth/login`);
    }
  }, []);

  const links = [
    { href: `/${locale}/admin`,          label: 'Dashboard', icon: LayoutDashboard },
    { href: `/${locale}/admin/products`, label: 'Products',  icon: Package },
    { href: `/${locale}/admin/orders`,   label: 'Orders',    icon: ShoppingBag },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 hidden md:flex flex-col
        bg-card border-r border-border/50">

        {/* Sidebar header */}
        <div className="p-4 border-b border-border/50">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Admin Panel
          </p>
        </div>

        {/* Nav links */}
        <nav className="p-2 space-y-0.5 flex-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${active
                    ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 transition-colors ${active ? 'text-orange-500' : 'group-hover:text-orange-500'}`} />
                  {label}
                </div>
                {active && <ChevronRight className="h-3.5 w-3.5 text-orange-500" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom badge */}
        <div className="p-3 border-t border-border/50">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs font-medium text-orange-600 dark:text-orange-400">Live</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto bg-background">
        {children}
      </div>
    </div>
  );
}