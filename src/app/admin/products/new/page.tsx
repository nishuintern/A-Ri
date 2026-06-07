"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import SkeletonLoader from "@/components/admin/SkeletonLoader";
import toast from "react-hot-toast";


/* Zod Validation Schema */
const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  sku: z.string().min(1, "SKU is required"),
  category: z.string().min(1, "Category is required"),
  productType: z.enum(["B2B", "B2C", "Both"]),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  discountPrice: z.coerce.number().optional(),
  costPrice: z.coerce.number().optional(),
  stockQuantity: z.coerce.number().int().min(0),
  weight: z.string().optional(),
  dimensions: z.string().optional(),
  status: z.enum(["Active", "Draft", "Archived"]),
  featured: z.boolean(),
  tags: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

/* Input Field Component */
function Field({
  label,
  error,
  children,
  span2,
}: Readonly<{
  label: string;
  error?: string;
  children: React.ReactNode;
  span2?: boolean;
}>) {
  return (
    <div className={span2 ? "md:col-span-2" : ""}>
      <label className="block text-sm font-medium text-[#1d1b1a] mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full px-4 py-2.5 rounded-xl bg-[#faf5ef] border border-[#e8e0d8] text-sm text-[#1d1b1a] outline-none focus:ring-2 focus:ring-[#675d4e]/30 focus:border-[#675d4e] transition-all";

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      status: "Draft",
      productType: "B2C",
      featured: false,
      stockQuantity: 0,
      price: 0,
    },
  });

  /* Auto-generate slug from name */
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

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        router.push("/admin/products");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to create product");
      }
    } catch (err) {
      console.error("Create product failed:", err);
      toast.error("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 rounded-xl hover:bg-[#f5ede3] transition-colors"
          >
            <ArrowLeft size={20} className="text-[#4c463e]" />
          </Link>
          <div>
            <h1
              className="text-3xl font-bold text-[#1d1b1a]"
              style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
            >
              Add Product
            </h1>
            <p className="text-sm text-[#4c463e]/60 mt-0.5">
              Fill in the product details below.
            </p>
          </div>
        </div>
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1d1b1a] text-[#fef8f6] rounded-xl text-sm font-semibold hover:bg-[#32302f] transition-colors disabled:opacity-50 shadow-sm"
          style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {saving ? "Saving..." : "Save Product"}
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl p-6 border border-[#e8e0d8] shadow-sm">
          <h2
            className="text-lg font-semibold text-[#1d1b1a] mb-5"
            style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
          >
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Product Name *" error={errors.name?.message}>
              <input
                {...register("name")}
                onBlur={generateSlug}
                placeholder="e.g. Himalayan Salt Makhana"
                className={inputClass}
              />
            </Field>
            <Field label="Slug *" error={errors.slug?.message}>
              <input
                {...register("slug")}
                placeholder="himalayan-salt-makhana"
                className={inputClass}
              />
            </Field>
            <Field label="SKU *" error={errors.sku?.message}>
              <input
                {...register("sku")}
                placeholder="AERI-SALT-001"
                className={inputClass}
              />
            </Field>
            <Field label="Category *" error={errors.category?.message}>
              <input
                {...register("category")}
                placeholder="Makhana Snacks"
                className={inputClass}
              />
            </Field>
            <Field
              label="Short Description"
              span2
              error={errors.shortDescription?.message}
            >
              <input
                {...register("shortDescription")}
                placeholder="A brief summary of the product"
                className={inputClass}
              />
            </Field>
            <Field
              label="Full Description"
              span2
              error={errors.description?.message}
            >
              <textarea
                {...register("description")}
                rows={4}
                placeholder="Detailed product description..."
                className={`${inputClass} resize-none`}
              />
            </Field>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Price (€) *" error={errors.price?.message}>
              <input
                type="number"
                step="0.01"
                {...register("price")}
                placeholder="4.99"
                className={inputClass}
              />
            </Field>
            <Field
              label="Discount Price (€)"
              error={errors.discountPrice?.message}
            >
              <input
                type="number"
                step="0.01"
                {...register("discountPrice")}
                placeholder="3.99"
                className={inputClass}
              />
            </Field>
            <Field label="Cost Price (€)" error={errors.costPrice?.message}>
              <input
                type="number"
                step="0.01"
                {...register("costPrice")}
                placeholder="2.50"
                className={inputClass}
              />
            </Field>
            <Field
              label="Stock Quantity *"
              error={errors.stockQuantity?.message}
            >
              <input
                type="number"
                {...register("stockQuantity")}
                placeholder="100"
                className={inputClass}
              />
            </Field>
            <Field label="Weight" error={errors.weight?.message}>
              <input
                {...register("weight")}
                placeholder="50g"
                className={inputClass}
              />
            </Field>
            <Field label="Dimensions" error={errors.dimensions?.message}>
              <input
                {...register("dimensions")}
                placeholder="10 x 15 x 5 cm"
                className={inputClass}
              />
            </Field>
          </div>
        </div>

        {/* Organization */}
        <div className="bg-white rounded-2xl p-6 border border-[#e8e0d8] shadow-sm">
          <h2
            className="text-lg font-semibold text-[#1d1b1a] mb-5"
            style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
          >
            Organization
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Product Type *">
              <select {...register("productType")} className={inputClass}>
                <option value="B2C">B2C</option>
                <option value="B2B">B2B</option>
                <option value="Both">Both</option>
              </select>
            </Field>
            <Field label="Status *">
              <select {...register("status")} className={inputClass}>
                <option value="Draft">Draft</option>
                <option value="Active">Active</option>
                <option value="Archived">Archived</option>
              </select>
            </Field>
            <Field label="Tags" span2>
              <input
                {...register("tags")}
                placeholder="premium, healthy, vegan (comma separated)"
                className={inputClass}
              />
            </Field>
            <div className="flex items-center gap-3 px-1">
              <input
                type="checkbox"
                {...register("featured")}
                id="featured"
                className="w-4 h-4 rounded accent-[#675d4e]"
              />
              <label htmlFor="featured" className="text-sm text-[#1d1b1a]">
                Featured Product
              </label>
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-2xl p-6 border border-[#e8e0d8] shadow-sm">
          <h2
            className="text-lg font-semibold text-[#1d1b1a] mb-5"
            style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
          >
            SEO
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <Field label="SEO Title">
              <input
                {...register("seoTitle")}
                placeholder="Product title for search engines"
                className={inputClass}
              />
            </Field>
            <Field label="SEO Description">
              <textarea
                {...register("seoDescription")}
                rows={2}
                placeholder="Product description for search engines"
                className={`${inputClass} resize-none`}
              />
            </Field>
          </div>
        </div>
      </form>
    </div>
  );
}
