"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Globe,
  User,
  LogOut,
  LayoutDashboard,
  UtensilsCrossed,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "./theme-toggle";
import { useCartStore } from "@/store/cart.store";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { getQueryClient } from '@/lib/query-client';

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, isAdmin, logout, getUser } = useAuth();
  const itemCount = useCartStore((s) => s.itemCount());
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const switchLocale = () => {
    const next = locale === 'en' ? 'ar' : 'en';
  localStorage.setItem('lang', next);
  getQueryClient().invalidateQueries(); 
  const newPath = pathname.replace(`/${locale}`, `/${next}`);
  router.push(newPath);
  router.refresh();
  };

  const user = getUser();

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2.5 font-bold text-xl group"
          >
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="bg-gradient-to-br from-orange-400 to-orange-600 p-2 rounded-xl shadow-md"
            >
              <UtensilsCrossed className="h-5 w-5 text-white" />
            </motion.div>
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              FoodApp
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {[
              { href: `/${locale}`, label: t("menu") },
              ...(isLoggedIn()
                ? [{ href: `/${locale}/orders`, label: t("orders") }]
                : []),
              ...(isAdmin()
                ? [{ href: `/${locale}/admin`, label: t("admin") }]
                : []),
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 rounded-full text-muted-foreground hover:text-foreground transition-colors group"
              >
                {link.label}
                <span className="absolute inset-x-4 bottom-1 h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full" />
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1.5">
            <ThemeToggle />

            <Button
              variant="ghost"
              size="sm"
              onClick={switchLocale}
              className="gap-1.5 rounded-full font-medium text-xs px-3"
            >
              <Globe className="h-3.5 w-3.5" />
              {locale === "en" ? "عربي" : "EN"}
            </Button>

            {/* Cart */}
            <Link href={`/${locale}/cart`}>
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1"
                    >
                      <Badge className="h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-orange-500 hover:bg-orange-500 rounded-full border-2 border-background">
                        {itemCount > 9 ? "9+" : itemCount}
                      </Badge>
                    </motion.div>
                  )}
                </Button>
              </motion.div>
            </Link>

            {/* Auth */}
            {isLoggedIn() ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 rounded-full pl-2 pr-3 border border-border/60 hover:border-orange-300"
                  >
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold">
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="hidden md:inline text-sm">
                      {user?.name?.split(" ")[0]}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-52 rounded-2xl p-1.5 shadow-xl"
                >
                  <div className="px-3 py-2 mb-1">
                    <p className="font-semibold text-sm">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    asChild
                    className="rounded-xl cursor-pointer"
                  >
                    <Link href={`/${locale}/orders`}>
                      <ShoppingCart className="h-4 w-4 mr-2 text-orange-500" />
                      {t("orders")}
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin() && (
                    <DropdownMenuItem
                      asChild
                      className="rounded-xl cursor-pointer"
                    >
                      <Link href={`/${locale}/admin`}>
                        <LayoutDashboard className="h-4 w-4 mr-2 text-orange-500" />
                        {t("admin")}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="rounded-xl cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {t("logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                  asChild
                >
                  <Link href={`/${locale}/auth/login`}>{t("login")}</Link>
                </Button>
                <Button
                  size="sm"
                  className="rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-md shadow-orange-500/25"
                  asChild
                >
                  <Link href={`/${locale}/auth/register`}>{t("register")}</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl px-4 py-3 space-y-1"
          >
            {[
              { href: `/${locale}`, label: t("menu") },
              ...(isLoggedIn()
                ? [{ href: `/${locale}/orders`, label: t("orders") }]
                : []),
              ...(isAdmin()
                ? [{ href: `/${locale}/admin`, label: t("admin") }]
                : []),
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-xl hover:bg-accent text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {!isLoggedIn() && (
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-full"
                  asChild
                >
                  <Link href={`/${locale}/auth/login`}>{t("login")}</Link>
                </Button>
                <Button
                  size="sm"
                  className="flex-1 rounded-full bg-orange-500 hover:bg-orange-600"
                  asChild
                >
                  <Link href={`/${locale}/auth/register`}>{t("register")}</Link>
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </motion.header>
    </>
  );
}
