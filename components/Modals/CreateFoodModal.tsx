"use client";

import { useState, useRef } from "react";
import { useFoodStore } from "@/stores/useFoodStore";
import { useImageUploadStore } from "@/stores/useImageUploadStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IconPhoto,
  IconUpload,
  IconSearch,
  IconLoader2,
  IconX,
  IconCheck,
} from "@tabler/icons-react";
import { toast } from "sonner";

const FOOD_CATEGORIES = [
  "Grains & Cereals",
  "Proteins",
  "Vegetables",
  "Fruits",
  "Dairy",
  "Legumes",
  "Beverages",
  "Snacks",
  "Soups & Stews",
  "Traditional Dishes",
];

const AFFORDABILITY_OPTIONS = ["low", "medium", "high"];

interface CreateFoodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    localName: string;
    canonicalName: string;
    category: string;
    affordability: string;
    tags: string;
    source: string;
    imageUrl: string;
    nutrients: {
      calories: string;
      carbs_g: string;
      protein_g: string;
      fat_g: string;
      fibre_g: string;
      gi: string;
    };
  };
  setFormData: (data: any) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export function CreateFoodModal({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  isLoading,
}: CreateFoodModalProps) {
  const { searchFoodImage } = useFoodStore();
  const { uploadToCloudinary, isUploading } = useImageUploadStore();

  const [imageTab, setImageTab] = useState<"upload" | "search">("search");
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedImage, setSuggestedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSearchQuery("");
      setSuggestedImage(null);
      setImageTab("search");
    }
    onOpenChange(newOpen);
  };

  const handleImageSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a food name to search");
      return;
    }

    setIsSearching(true);
    setSuggestedImage(null);

    try {
      const result = await searchFoodImage(searchQuery, true);

      if (!result || !result.imageUrl || result.source === "none") {
        toast.error("No image found. Try uploading your own.");
        return;
      }

      setSuggestedImage(result.imageUrl);
      toast.success(`Found image from ${result.source}`);
    } catch {
      toast.error("Image search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleUseSuggestedImage = () => {
    if (suggestedImage) {
      setFormData({ ...formData, imageUrl: suggestedImage });
      setSuggestedImage(null);
      toast.success("Image added");
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadToCloudinary(file);
    if (url) {
      setFormData({ ...formData, imageUrl: url });
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, imageUrl: "" });
    setSuggestedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    const required = [
      { field: formData.localName, name: "Local Name" },
      { field: formData.category, name: "Category" },
      { field: formData.nutrients.calories, name: "Calories" },
      { field: formData.nutrients.carbs_g, name: "Carbs" },
      { field: formData.nutrients.protein_g, name: "Protein" },
      { field: formData.nutrients.fat_g, name: "Fat" },
      { field: formData.nutrients.fibre_g, name: "Fibre" },
      { field: formData.nutrients.gi, name: "GI" },
    ];

    for (const item of required) {
      if (!item.field || item.field.toString().trim() === "") {
        toast.error(`${item.name} is required`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-hidden flex flex-col gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>Add New Food</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new food item to the database.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <FieldGroup>
            {/* Image Section - Compact */}
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="flex items-center gap-2 mb-3">
                <IconPhoto className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Food Image</span>
                <span className="text-xs text-muted-foreground">
                  (optional)
                </span>
              </div>

              {formData.imageUrl ? (
                <div className="relative">
                  <img
                    src={formData.imageUrl}
                    alt="Food"
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
                  >
                    <IconX className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <Tabs
                  value={imageTab}
                  onValueChange={(v: any) => setImageTab(v)}
                >
                  <TabsList className="w-full grid grid-cols-2 h-9">
                    <TabsTrigger value="search" className="text-xs">
                      <IconSearch className="w-3.5 h-3.5 mr-1.5" />
                      AI Search
                    </TabsTrigger>
                    <TabsTrigger value="upload" className="text-xs">
                      <IconUpload className="w-3.5 h-3.5 mr-1.5" />
                      Upload
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="search" className="mt-3 space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Search for food image..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleImageSearch()
                        }
                        className="h-9 text-sm"
                      />
                      <Button
                        type="button"
                        onClick={handleImageSearch}
                        disabled={isSearching}
                        size="sm"
                        className="h-9 px-3"
                      >
                        {isSearching ? (
                          <IconLoader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <IconSearch className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    {isSearching && (
                      <div className="flex items-center justify-center py-6 text-xs text-muted-foreground">
                        <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />
                        Searching...
                      </div>
                    )}

                    {suggestedImage && (
                      <div className="space-y-2">
                        <img
                          src={suggestedImage}
                          alt="Suggested"
                          className="w-full h-32 object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          onClick={handleUseSuggestedImage}
                          size="sm"
                          variant="secondary"
                          className="w-full h-8 text-xs"
                        >
                          <IconCheck className="w-3.5 h-3.5 mr-1.5" />
                          Use This Image
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="upload" className="mt-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/webp"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      variant="outline"
                      className="w-full h-9 text-xs"
                    >
                      {isUploading ? (
                        <>
                          <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <IconUpload className="w-4 h-4 mr-2" />
                          Choose File
                        </>
                      )}
                    </Button>
                    <p className="text-[10px] text-muted-foreground text-center mt-2">
                      JPG, PNG, WEBP • Max 5MB
                    </p>
                  </TabsContent>
                </Tabs>
              )}
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>
                  Local Name <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  placeholder="e.g., Jollof Rice"
                  value={formData.localName}
                  onChange={(e) =>
                    setFormData({ ...formData, localName: e.target.value })
                  }
                />
              </Field>
              <Field>
                <FieldLabel>Canonical Name</FieldLabel>
                <Input
                  placeholder="e.g., jollof_rice"
                  value={formData.canonicalName}
                  onChange={(e) =>
                    setFormData({ ...formData, canonicalName: e.target.value })
                  }
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>
                  Category <span className="text-destructive">*</span>
                </FieldLabel>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {FOOD_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Affordability</FieldLabel>
                <Select
                  value={formData.affordability}
                  onValueChange={(value) =>
                    setFormData({ ...formData, affordability: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {AFFORDABILITY_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt.charAt(0).toUpperCase() + opt.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field>
              <FieldLabel>Tags</FieldLabel>
              <Input
                placeholder="e.g., low-gi, high-protein, vegetarian"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
              />
            </Field>

            {/* Nutrients Section */}
            <div className="space-y-3">
              <span className="text-sm font-medium">
                Nutrients{" "}
                <span className="text-muted-foreground font-normal">
                  (per 100g)
                </span>{" "}
                <span className="text-destructive">*</span>
              </span>
              <div className="grid grid-cols-3 gap-3">
                <Field>
                  <FieldLabel className="text-xs">Calories</FieldLabel>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={formData.nutrients.calories}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nutrients: {
                          ...formData.nutrients,
                          calories: e.target.value,
                        },
                      })
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel className="text-xs">Carbs (g)</FieldLabel>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={formData.nutrients.carbs_g}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nutrients: {
                          ...formData.nutrients,
                          carbs_g: e.target.value,
                        },
                      })
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel className="text-xs">Protein (g)</FieldLabel>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={formData.nutrients.protein_g}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nutrients: {
                          ...formData.nutrients,
                          protein_g: e.target.value,
                        },
                      })
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel className="text-xs">Fat (g)</FieldLabel>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={formData.nutrients.fat_g}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nutrients: {
                          ...formData.nutrients,
                          fat_g: e.target.value,
                        },
                      })
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel className="text-xs">Fibre (g)</FieldLabel>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={formData.nutrients.fibre_g}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nutrients: {
                          ...formData.nutrients,
                          fibre_g: e.target.value,
                        },
                      })
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel className="text-xs">GI</FieldLabel>
                  <Input
                    type="number"
                    step="1"
                    placeholder="0"
                    value={formData.nutrients.gi}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nutrients: {
                          ...formData.nutrients,
                          gi: e.target.value,
                        },
                      })
                    }
                  />
                </Field>
              </div>
            </div>

            <Field>
              <FieldLabel>Source</FieldLabel>
              <Select
                value={formData.source}
                onValueChange={(value) =>
                  setFormData({ ...formData, source: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="validated">Validated</SelectItem>
                    <SelectItem value="estimated">Estimated</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-muted/30">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Food"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
