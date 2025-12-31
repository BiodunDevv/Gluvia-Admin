"use client";

import { useEffect, useState } from "react";
import { useFoodStore, type Food } from "@/stores/useFoodStore";
import { Button } from "@/components/ui/button";
import { IconPlus, IconUpload } from "@tabler/icons-react";
import { BatchUploadDialog } from "@/components/Modals/BatchUploadDialog";
import { FoodsDataTable } from "@/components/AllTables/foods-data-table";
import { CreateFoodModal } from "@/components/Modals/CreateFoodModal";
import { EditFoodModal } from "@/components/Modals/EditFoodModal";
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

export default function FoodsPage() {
  const {
    foods,
    pagination,
    isLoading,
    fetchFoods,
    createFood,
    updateFood,
    deleteFood,
  } = useFoodStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBatchUploadOpen, setIsBatchUploadOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    localName: "",
    canonicalName: "",
    category: "",
    affordability: "medium",
    tags: "",
    source: "",
    imageUrl: "",
    nutrients: {
      calories: "",
      carbs_g: "",
      protein_g: "",
      fat_g: "",
      fibre_g: "",
      gi: "",
    },
  });

  useEffect(() => {
    fetchFoods({ page: 1, limit: 50 });
  }, [fetchFoods]);

  const handleSearch = () => {
    fetchFoods({
      search: searchQuery || undefined,
      category: categoryFilter !== "all" ? categoryFilter : undefined,
      page: 1,
      limit: 50,
    });
  };

  const handlePageChange = (newPage: number) => {
    fetchFoods({
      search: searchQuery || undefined,
      category: categoryFilter !== "all" ? categoryFilter : undefined,
      page: newPage,
      limit: 50,
    });
  };

  const resetForm = () => {
    setFormData({
      localName: "",
      canonicalName: "",
      category: "",
      affordability: "medium",
      tags: "",
      source: "",
      imageUrl: "",
      nutrients: {
        calories: "",
        carbs_g: "",
        protein_g: "",
        fat_g: "",
        fibre_g: "",
        gi: "",
      },
    });
  };

  const handleCreateFood = async () => {
    // Validate required fields
    if (!formData.localName.trim()) {
      toast.error("Local name is required");
      return;
    }

    const success = await createFood({
      localName: formData.localName.trim(),
      canonicalName: formData.canonicalName.trim() || undefined,
      category: formData.category || undefined,
      imageUrl: formData.imageUrl.trim() || undefined,
      affordability: formData.affordability as "low" | "medium" | "high",
      source: formData.source as "manual" | "validated" | "estimated",
      nutrients: {
        calories: Number(formData.nutrients.calories) || 0,
        carbs_g: Number(formData.nutrients.carbs_g) || 0,
        protein_g: Number(formData.nutrients.protein_g) || 0,
        fat_g: Number(formData.nutrients.fat_g) || 0,
        fibre_g: Number(formData.nutrients.fibre_g) || 0,
        gi: Number(formData.nutrients.gi) || null,
      },
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
    if (success) {
      setIsCreateDialogOpen(false);
      resetForm();
    }
  };

  const handleEditClick = (id: string) => {
    const food = foods.find((f) => f._id === id);
    if (food) {
      setEditingFood(food);
      setFormData({
        localName: food.localName,
        canonicalName: food.canonicalName || "",
        category: food.category || "",
        affordability: food.affordability || "medium",
        tags: (food.tags || []).join(", "),
        source: food.source || "validated",
        imageUrl: food.imageUrl || "",
        nutrients: {
          calories: String(food.nutrients.calories),
          carbs_g: String(food.nutrients.carbs_g),
          protein_g: String(food.nutrients.protein_g),
          fat_g: String(food.nutrients.fat_g),
          fibre_g: String(food.nutrients.fibre_g),
          gi: String(food.nutrients.gi ?? 0),
        },
      });
      setIsEditDialogOpen(true);
    }
  };

  const handleUpdateFood = async () => {
    if (!editingFood) return;

    // Validate required fields
    if (!formData.localName.trim()) {
      toast.error("Local name is required");
      return;
    }

    const success = await updateFood(editingFood._id, {
      localName: formData.localName.trim(),
      canonicalName: formData.canonicalName.trim() || undefined,
      category: formData.category || undefined,
      imageUrl: formData.imageUrl.trim() || undefined,
      affordability: formData.affordability as "low" | "medium" | "high",
      source: formData.source as "manual" | "validated" | "estimated",
      nutrients: {
        calories: Number(formData.nutrients.calories) || 0,
        carbs_g: Number(formData.nutrients.carbs_g) || 0,
        protein_g: Number(formData.nutrients.protein_g) || 0,
        fat_g: Number(formData.nutrients.fat_g) || 0,
        fibre_g: Number(formData.nutrients.fibre_g) || 0,
        gi: Number(formData.nutrients.gi) || null,
      },
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
    if (success) {
      setIsEditDialogOpen(false);
      setEditingFood(null);
      resetForm();
    }
  };

  const handleDeleteFood = async (food: Food) => {
    if (confirm(`Are you sure you want to delete "${food.localName}"?`)) {
      await deleteFood(food._id);
    }
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Food Database
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage food items and nutritional data
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => setIsBatchUploadOpen(true)}
            className="gap-2"
          >
            <IconUpload className="mr-2 h-4 w-4" />
            Batch Upload
          </Button>
          <Button onClick={handleOpenCreateModal} className="gap-2">
            <IconPlus className="mr-2 h-4 w-4" />
            Add Food
          </Button>
        </div>
      </div>

      <FoodsDataTable
        data={foods}
        isLoading={isLoading}
        pagination={pagination || undefined}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        categoryValue={categoryFilter}
        onCategoryChange={setCategoryFilter}
        onEdit={handleEditClick}
        onDelete={handleDeleteFood}
      />

      <CreateFoodModal
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleCreateFood}
        isLoading={isLoading}
      />

      <EditFoodModal
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleUpdateFood}
        isLoading={isLoading}
      />

      {/* Batch Upload Dialog */}
      <BatchUploadDialog
        open={isBatchUploadOpen}
        onOpenChange={setIsBatchUploadOpen}
      />
    </div>
  );
}
