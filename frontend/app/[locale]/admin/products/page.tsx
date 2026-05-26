"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  useAdminProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useCategories,
  useAdminCategories,
} from "@/hooks/use-products";
import { toast } from "sonner";

const EMPTY_FORM = {
  nameEn: "",
  nameAr: "",
  descEn: "",
  descAr: "",
  price: "",
  image: "",
  categoryId: "",
  available: true,
};

export default function AdminProductsPage() {
  const { data: products, isLoading } = useAdminProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const { data: categories } = useAdminCategories();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (p: any) => {
    setForm({
      nameEn: p.nameEn,
      nameAr: p.nameAr,
      descEn: p.descEn,
      descAr: p.descAr,
      price: String(p.price),
      image: p.image,
      categoryId: p.categoryId,
      available: p.available,
    });
    setEditing(p.id);
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedPrice = parseFloat(form.price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (!form.categoryId) {
      toast.error("Please select a category");
      return;
    }

    const payload = {
      nameEn: form.nameEn,
      nameAr: form.nameAr,
      descEn: form.descEn,
      descAr: form.descAr,
      price: parsedPrice,
      image: form.image,
      categoryId: form.categoryId,
      available: form.available,
    };
    console.log("categoryId value:", JSON.stringify(form.categoryId));
    console.log("categoryId type:", typeof form.categoryId);
    console.log("categories:", JSON.stringify(categories));
    console.log("full payload:", JSON.stringify(payload, null, 2));
    try {
      if (editing) {
        await updateProduct.mutateAsync({ id: editing, ...payload });
        toast.success("Product updated");
      } else {
        await createProduct.mutateAsync(payload);
        toast.success("Product created");
      }
      setOpen(false);
    } catch (err: any) {
      console.log("Full error:", err?.response?.data);
      const serverMessage = err?.response?.data?.message;
      const message = Array.isArray(serverMessage)
        ? serverMessage.join(", ")
        : (serverMessage ?? "Something went wrong");
      toast.error(message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button
          className="bg-orange-500 hover:bg-orange-600 gap-2"
          onClick={openCreate}
        >
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products?.map((p: any) => (
            <Card key={p.id} className="border-0 shadow-sm">
              <CardContent className="p-4 flex gap-3 items-center">
                <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={p.image}
                    alt={p.nameEn}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{p.nameEn}</p>
                  <p className="text-sm text-orange-500 font-bold">
                    ${p.price}
                  </p>
                  <Badge
                    variant={p.available ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {p.available ? "Available" : "Unavailable"}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(p)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:text-red-600"
                    onClick={() => handleDelete(p.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Product" : "Add Product"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Name (EN)</Label>
                <Input
                  value={form.nameEn}
                  onChange={(e) => set("nameEn", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Name (AR)</Label>
                <Input
                  value={form.nameAr}
                  onChange={(e) => set("nameAr", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Description (EN)</Label>
                <Input
                  value={form.descEn}
                  onChange={(e) => set("descEn", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Description (AR)</Label>
                <Input
                  value={form.descAr}
                  onChange={(e) => set("descAr", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Price ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Category</Label>
                <Select
                  value={form.categoryId}
                  onValueChange={(v) => set("categoryId", v)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.nameEn} / {c.nameAr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label>Image URL</Label>
              <Input
                value={form.image}
                onChange={(e) => set("image", e.target.value)}
                placeholder="https://..."
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="available"
                checked={form.available}
                onChange={(e) => set("available", e.target.checked)}
              />
              <Label htmlFor="available">Available</Label>
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={createProduct.isPending || updateProduct.isPending}
            >
              {editing ? "Update Product" : "Create Product"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
