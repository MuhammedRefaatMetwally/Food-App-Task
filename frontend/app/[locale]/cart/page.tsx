"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cart.store";
import { usePlaceOrder } from "@/hooks/use-orders";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CartPage() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { items, removeItem, updateQty, clearCart, total } = useCartStore();
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "CASH_ON_DELIVERY" | "ONLINE"
  >("CASH_ON_DELIVERY");
  const placeOrder = usePlaceOrder();

  const handleCheckout = async () => {
    if (!isLoggedIn()) {
      router.push(`/${locale}/auth/login`);
      return;
    }
    if (!address.trim()) {
      toast.error("Please enter your delivery address");
      return;
    }
    if (items.length === 0) return;

    try {
      const order = await placeOrder.mutateAsync({
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
        paymentMethod,
        address,
      });

      clearCart();

      if (paymentMethod === "ONLINE") {
        router.push(`/${locale}/orders/${order.data.id}/pay`);
      } else {
        toast.success("Order placed successfully! 🎉");
        router.push(`/${locale}/orders`);
      }
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">{t("empty")}</h2>
        <p className="text-muted-foreground mb-6">
          Add some items from the menu
        </p>
        <Button asChild className="bg-orange-500 hover:bg-orange-600">
          <Link href={`/${locale}`}>Browse Menu</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <Card
              key={product.id}
              className="border border-border/40 shadow-sm bg-card"
            >
              <CardContent className="p-4 flex gap-4 items-center">
                <div className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate text-foreground">
                    {product.name}
                  </h3>
                  <p className="text-orange-500 font-bold">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-border/60 hover:bg-muted"
                    onClick={() => updateQty(product.id, quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center font-medium text-foreground">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-border/60 hover:bg-muted"
                    onClick={() => updateQty(product.id, quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <div className="text-right min-w-[60px]">
                  <p className="font-bold text-foreground">
                    ${(product.price * quantity).toFixed(2)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-400 hover:text-red-500 hover:bg-red-500/10 dark:hover:bg-red-500/20"
                  onClick={() => removeItem(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order summary */}
        <div>
          <Card className="border border-border/40 shadow-sm bg-card sticky top-20">
            <CardHeader className="pb-4">
              <CardTitle className="text-foreground">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Address */}
              <div className="space-y-1.5">
                <Label className="text-foreground/80 text-sm font-medium">
                  {t("address")}
                </Label>
                <Input
                  placeholder="123 Main St, City"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-background border-border/60 focus:border-orange-400 focus:ring-orange-400/20 placeholder:text-muted-foreground/50"
                />
              </div>

              {/* Payment method */}
              <div className="space-y-2">
                <Label className="text-foreground/80 text-sm font-medium">
                  {t("paymentMethod")}
                </Label>
                <div className="space-y-2">
                  {(
                    [
                      {
                        value: "CASH_ON_DELIVERY",
                        label: t("cod"),
                        id: "cod",
                        icon: "💵",
                      },
                      {
                        value: "ONLINE",
                        label: t("online"),
                        id: "online",
                        icon: "💳",
                      },
                    ] as const
                  ).map((option) => {
                    const isSelected = paymentMethod === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setPaymentMethod(option.value)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all duration-150",
                          isSelected
                            ? "border-orange-500 bg-orange-500/10 dark:bg-orange-500/15 text-foreground"
                            : "border-border/50 bg-background hover:border-border hover:bg-muted/60 dark:hover:bg-muted/30 text-foreground",
                        )}
                      >
                        {/* Custom radio circle */}
                        <span
                          className={cn(
                            "flex-shrink-0 h-4 w-4 rounded-full border-2 flex items-center justify-center transition-colors",
                            isSelected
                              ? "border-orange-500"
                              : "border-muted-foreground/40",
                          )}
                        >
                          {isSelected && (
                            <span className="h-2 w-2 rounded-full bg-orange-500 block" />
                          )}
                        </span>
                        <span className="text-sm font-medium flex-1">
                          {option.label}
                        </span>
                        <span className="text-base" aria-hidden>
                          {option.icon}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Separator className="bg-border/50" />

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-base font-medium text-foreground/80">
                  {t("total")}
                </span>
                <span className="text-xl font-bold text-orange-500">
                  ${total().toFixed(2)}
                </span>
              </div>

              <Button
                className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 h-12 text-base font-medium transition-colors disabled:opacity-60"
                onClick={handleCheckout}
                disabled={placeOrder.isPending}
              >
                {placeOrder.isPending ? t("placing") : t("placeOrder")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
