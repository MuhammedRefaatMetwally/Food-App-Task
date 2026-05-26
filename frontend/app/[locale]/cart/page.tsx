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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCartStore } from "@/store/cart.store";
import { usePlaceOrder } from "@/hooks/use-orders";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import Link from "next/link";

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
            <Card key={product.id} className="border-0 shadow-sm">
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
                  <h3 className="font-semibold truncate">{product.name}</h3>
                  <p className="text-orange-500 font-bold">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQty(product.id, quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQty(product.id, quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <div className="text-right min-w-[60px]">
                  <p className="font-bold">
                    ${(product.price * quantity).toFixed(2)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-400 hover:text-red-600 hover:bg-red-50"
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
          <Card className="border-0 shadow-sm sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Address */}
              <div className="space-y-1">
                <Label>{t("address")}</Label>
                <Input
                  placeholder="123 Main St, City"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              {/* Payment method */}
              <div className="space-y-2">
                <Label>{t("paymentMethod")}</Label>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(v) => setPaymentMethod(v as any)}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="CASH_ON_DELIVERY" id="cod" />
                    <Label htmlFor="cod" className="cursor-pointer flex-1">
                      {t("cod")}
                    </Label>
                  </div>
                  <div className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="ONLINE" id="online" />
                    <Label htmlFor="online" className="cursor-pointer flex-1">
                      {t("online")}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between text-lg font-bold">
                <span>{t("total")}</span>
                <span className="text-orange-500">${total().toFixed(2)}</span>
              </div>

              <Button
                className="w-full bg-orange-500 hover:bg-orange-600 h-12 text-base"
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
