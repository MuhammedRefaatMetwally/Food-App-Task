"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale as useIntlLocale } from "next-intl";
import { LayoutDashboard, Package, ShoppingBag } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRequireAuth } from "@/hooks/use-require-auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useRequireAuth();
  const { isLoggedIn, isAdmin } = useAuth();
  const router = useRouter();
  const locale = useIntlLocale();

  useEffect(() => {
    if (!isLoggedIn() || !isAdmin()) {
      router.replace(`/${locale}/auth/login`);
    }
  }, []);

  const links = [
    { href: `/${locale}/admin`, label: "Dashboard", icon: LayoutDashboard },
    { href: `/${locale}/admin/products`, label: "Products", icon: Package },
    { href: `/${locale}/admin/orders`, label: "Orders", icon: ShoppingBag },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r flex-shrink-0 hidden md:flex flex-col">
        <div className="p-4 border-b">
          <p className="font-bold text-sm text-muted-foreground uppercase tracking-wider">
            Admin Panel
          </p>
        </div>
        <nav className="p-3 space-y-1 flex-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-gray-50">{children}</div>
    </div>
  );
}
