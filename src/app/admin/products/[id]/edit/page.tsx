"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import SkeletonLoader from "@/components/admin/SkeletonLoader";
import toast from "react-hot-toast";


/* Form Validation Schema */
const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  slug: z.string().min(2, "Slug is required"),
  sku: z.string().min(2, "SKU is required"),
  description: z.string().optional(),
  category: z.string().min(2, "Category is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  discountPrice: z.coerce.number().optional(),
  stockQuantity: z.coerce.number().min(0, "Stock cannot be negative"),
  status: z.enum(["Active", "Draft", "Archived"]),
  featured: z.boolean(),
  productType: z.string(),
  tags: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
  });

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/admin/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        const p = data.product;
        reset({
          name: p.name,
          slug: p.slug,
          sku: p.sku,
          description: p.description || "",
          category: p.category,
          price: p.price,
          discountPrice: p.discountPrice || undefined,
          stockQuantity: p.stockQuantity,
          status: p.status,
          featured: p.featured,
          productType: p.productType,
          tags: p.tags?.join(", ") || "",
        });
        setImageUrls(p.images || []);
      }
    } catch (err) {
      console.error("Failed to fetch product:", err);
    } finally {
      setLoading(false);
    }
  };

  /* Auto-generate slug */
  const nameValue = watch("name");
  const generateSlug = () => {
    if (nameValue) {
      const slug = nameValue
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setValue("slug", slug);
    }
  };

  /* Handle Image Upload */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setImageUrls((prev) => [...prev, data.url]);
      } else {
        toast.error("Failed to upload image");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Error uploading image");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImageUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  /* Form submit handler */
  const onSubmit = async (data: ProductFormData) => {
    setSaving(true);
    try {
      const body = {
        ...data,
        tags: data.tags ? data.tags.split(",").map((t) => t.trim()) : [],
        images: imageUrls,
      };

      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update product");
      }
    } catch (err) {
      console.error("Update product failed:", err);
      toast.error("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 w-full max-w-4xl mx-auto">
        <SkeletonLoader type="form" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="w-10 h-10 rounded-full bg-white border border-[#e8e0d8] flex items-center justify-center text-[#4c463e] hover:bg-[#faf5ef] transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1
              className="text-2xl font-bold text-[#1d1b1a]"
              style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
            >
              Edit Product
            </h1>
          </div>
        </div>
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={saving || uploadingImage}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1d1b1a] text-[#fef8f6] rounded-xl text-sm font-semibold hover:bg-[#32302f] transition-colors disabled:opacity-70"
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-6 border border-[#e8e0d8] shadow-sm">
            <h2
              className="text-lg font-semibold text-[#1d1b1a] mb-5"
              style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
            >
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#4c463e] mb-1.5">
                  Product Name *
                </label>
                <input
                  id="name"
                  {...register("name")}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#faf5ef] border border-[#e8e0d8] text-sm outline-none focus:ring-2 focus:ring-[#675d4e]/30"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-[#4c463e] mb-1.5 flex justify-between">
                    <span>Slug *</span>
                    <button
                      type="button"
                      onClick={generateSlug}
                      className="text-xs text-[#675d4e] hover:underline"
                    >
                      Generate from name
                    </button>
                  </label>
                  <input
                    id="slug"
                    {...register("slug")}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#faf5ef] border border-[#e8e0d8] text-sm outline-none focus:ring-2 focus:ring-[#675d4e]/30"
                  />
                  {errors.slug && (
                    <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="sku" className="block text-sm font-medium text-[#4c463e] mb-1.5">
                    SKU *
                  </label>
                  <input
                    id="sku"
                    {...register("sku")}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#faf5ef] border border-[#e8e0d8] text-sm outline-none focus:ring-2 focus:ring-[#675d4e]/30"
                  />
                  {errors.sku && (
                    <p className="text-red-500 text-xs mt-1">{errors.sku.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-[#4c463e] mb-1.5">
                  Description
                </label>
                <textarea
                  id="description"
                  {...register("description")}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#faf5ef] border border-[#e8e0d8] text-sm outline-none focus:ring-2 focus:ring-[#675d4e]/30 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl p-6 border border-[#e8e0d8] shadow-sm">
            <h2
              className="text-lg font-semibold text-[#1d1b1a] mb-5"
              style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
            >
              Product Images
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 flex-wrap">
                {imageUrls.map((url, idx) => (
                  <div key={url + idx} className="relative w-24 h-24 border border-[#e8e0d8] rounded-xl overflow-hidden group">
                    <Image src={url} alt={`Preview ${idx}`} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                {imageUrls.length < 5 && (
                  <label className="w-24 h-24 border-2 border-dashed border-[#e8e0d8] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-[#faf5ef] transition-colors relative">
                    {uploadingImage ? (
                      <Loader2 size={24} className="text-[#4c463e]/40 animate-spin" />
                    ) : (
                      <>
                        <Plus size={24} className="text-[#4c463e]/40" />
                        <span className="text-[10px] text-[#4c463e]/60 mt-1">Upload</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                  </label>
                )}
              </div>
              <p className="text-xs text-[#4c463e]/60">You can upload up to 5 images. First image will be used as the thumbnail.</p>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white rounded-2xl p-6 border border-[#e8e0d8] shadow-sm">
            <h2
              className="text-lg font-semibold text-[#1d1b1a] mb-5"
              style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
            >
              Pricing & Inventory
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-[#4c463e] mb-1.5">
                  Price (€) *
                </label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register("price")}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#faf5ef] border border-[#e8e0d8] text-sm outline-none focus:ring-2 focus:ring-[#675d4e]/30"
                />
                {errors.price && (
                  <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="discountPrice" className="block text-sm font-medium text-[#4c463e] mb-1.5">
                  Discount Price (€)
                </label>
                <input
                  id="discountPrice"
                  type="number"
                  step="0.01"
                  {...register("discountPrice")}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#faf5ef] border border-[#e8e0d8] text-sm outline-none focus:ring-2 focus:ring-[#675d4e]/30"
                />
              </div>
              <div>
                <label htmlFor="stockQuantity" className="block text-sm font-medium text-[#4c463e] mb-1.5">
                  Stock Quantity *
                </label>
                <input
                  id="stockQuantity"
                  type="number"
                  {...register("stockQuantity")}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#faf5ef] border border-[#e8e0d8] text-sm outline-none focus:ring-2 focus:ring-[#675d4e]/30"
                />
                {errors.stockQuantity && (
                  <p className="text-red-500 text-xs mt-1">{errors.stockQuantity.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Organization */}
          <div className="bg-white rounded-2xl p-6 border border-[#e8e0d8] shadow-sm">
            <h2
              className="text-lg font-semibold text-[#1d1b1a] mb-5"
              style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
            >
              Organization
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-[#4c463e] mb-1.5">
                  Status
                </label>
                <select
                  id="status"
                  {...register("status")}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#faf5ef] border border-[#e8e0d8] text-sm outline-none focus:ring-2 focus:ring-[#675d4e]/30"
                >
                  <option value="Draft">Draft</option>
                  <option value="Active">Active</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-[#4c463e] mb-1.5">
                  Category *
                </label>
                <input
                  id="category"
                  {...register("category")}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#faf5ef] border border-[#e8e0d8] text-sm outline-none focus:ring-2 focus:ring-[#675d4e]/30"
                />
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="productType" className="block text-sm font-medium text-[#4c463e] mb-1.5">
                  Product Type
                </label>
                <select
                  id="productType"
                  {...register("productType")}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#faf5ef] border border-[#e8e0d8] text-sm outline-none focus:ring-2 focus:ring-[#675d4e]/30"
                >
                  <option value="B2C">B2C (Retail)</option>
                  <option value="B2B">B2B (Wholesale)</option>
                  <option value="Both">Both</option>
                </select>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-[#4c463e] mb-1.5">
                  Tags (comma separated)
                </label>
                <input
                  id="tags"
                  {...register("tags")}
                  placeholder="e.g. spicy, vegan, new"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#faf5ef] border border-[#e8e0d8] text-sm outline-none focus:ring-2 focus:ring-[#675d4e]/30"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 p-3 border border-[#e8e0d8] rounded-xl cursor-pointer hover:bg-[#faf5ef] transition-colors">
                  <input
                    type="checkbox"
                    {...register("featured")}
                    className="w-4 h-4 text-[#1d1b1a] rounded border-[#e8e0d8] focus:ring-[#1d1b1a]"
                  />
                  <div>
                    <p className="text-sm font-medium text-[#1d1b1a]">
                      Featured Product
                    </p>
                    <p className="text-[11px] text-[#4c463e]/60">
                      Show on homepage and top of lists
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
