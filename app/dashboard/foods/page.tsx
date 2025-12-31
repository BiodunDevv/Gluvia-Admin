"use client";

import { useEffect, useState } from "react";
import { useFoodStore, type Food } from "@/stores/useFoodStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconPlus, IconUpload } from "@tabler/icons-react";
import { BatchUploadDialog } from "@/components/BatchUploadDialog";
import { FoodsDataTable } from "@/components/foods-data-table";

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
    nutrients: {
      calories: 0,
      carbs_g: 0,
      protein_g: 0,
      fat_g: 0,
      fibre_g: 0,
      gi: 0,
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
      nutrients: {
        calories: 0,
        carbs_g: 0,
        protein_g: 0,
        fat_g: 0,
        fibre_g: 0,
        gi: 0,
      },
    });
  };

  const handleCreateFood = async () => {
    const success = await createFood({
      ...formData,
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
        canonicalName: food.canonicalName,
        category: food.category,
        affordability: food.affordability,
        tags: food.tags.join(", "),
        source: food.source,
        nutrients: { ...food.nutrients },
      });
      setIsEditDialogOpen(true);
    }
  };

  const handleUpdateFood = async () => {
    if (!editingFood) return;
    const success = await updateFood(editingFood._id, {
      ...formData,
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

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Food Database</h1>
          <p className="text-muted-foreground">
            Manage food items and nutritional data
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsBatchUploadOpen(true)}>
            <IconUpload className="mr-2 h-4 w-4" />
            Batch Upload
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
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

      {/* Create Food Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Food</DialogTitle>
            <DialogDescription>
              Enter the details for the new food item.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="localName">Local Name</Label>
                <Input
                  id="localName"
                  value={formData.localName}
                  onChange={(e) =>
                    setFormData({ ...formData, localName: e.target.value })
                  }
                  placeholder="e.g., Jollof Rice"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="canonicalName">Canonical Name</Label>
                <Input
                  id="canonicalName"
                  value={formData.canonicalName}
                  onChange={(e) =>
                    setFormData({ ...formData, canonicalName: e.target.value })
                  }
                  placeholder="e.g., jollof_rice"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
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
                    {FOOD_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="affordability">Affordability</Label>
                <Select
                  value={formData.affordability}
                  onValueChange={(value) =>
                    setFormData({ ...formData, affordability: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select affordability" />
                  </SelectTrigger>
                  <SelectContent>
                    {AFFORDABILITY_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="e.g., low-gi, high-protein, vegetarian"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Textarea
                id="source"
                value={formData.source}
                onChange={(e) =>
                  setFormData({ ...formData, source: e.target.value })
                }
                placeholder="Data source reference"
              />
            </div>
            <div className="space-y-2">
              <Label>Nutrients (per 100g)</Label>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="calories" className="text-xs">
                    Calories
                  </Label>
                  <Input
                    id="calories"
                    type="number"
                    value={formData.nutrients.calories}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nutrients: {
                          ...formData.nutrients,
                          calories: Number(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="carbs" className="text-xs">
                    Carbs (g)
                  </Label>
                  <Input
                    id="carbs"
                    type="number"
                    value={formData.nutrients.carbs_g}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nutrients: {
                          ...formData.nutrients,
                          carbs_g: Number(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="protein" className="text-xs">
                    Protein (g)
                  </Label>
                  <Input
                    id="protein"
                    type="number"
                    value={formData.nutrients.protein_g}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nutrients: {
                          ...formData.nutrients,
                          protein_g: Number(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="fat" className="text-xs">
                    Fat (g)
                  </Label>
                  <Input
                    id="fat"
                    type="number"
                    value={formData.nutrients.fat_g}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nutrients: {
                          ...formData.nutrients,
                          fat_g: Number(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="fibre" className="text-xs">
                    Fibre (g)
                  </Label>
                  <Input
                    id="fibre"
                    type="number"
                    value={formData.nutrients.fibre_g}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nutrients: {
                          ...formData.nutrients,
                          fibre_g: Number(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="gi" className="text-xs">
                    GI
                  </Label>
                  <Input
                    id="gi"
                    type="number"
                    value={formData.nutrients.gi}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nutrients: {
                          ...formData.nutrients,
                          gi: Number(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateFood} disabled={isLoading}>
              Create Food
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Food Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Food</DialogTitle>
            <DialogDescription>
              Update the details for this food item.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-localName">Local Name</Label>
                <Input
                  id="edit-localName"
                  value={formData.localName}
                  onChange={(e) =>
                    setFormData({ ...formData, localName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-canonicalName">Canonical Name</Label>
                <Input
                  id="edit-canonicalName"
                  value={formData.canonicalName}
                  onChange={(e) =>
                    setFormData({ ...formData, canonicalName: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
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
                    {FOOD_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-affordability">Affordability</Label>
                <Select
                  value={formData.affordability}
                  onValueChange={(value) =>
                    setFormData({ ...formData, affordability: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select affordability" />
                  </SelectTrigger>
                  <SelectContent>
                    {AFFORDABILITY_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
              <Input
                id="edit-tags"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-source">Source</Label>
              <Textarea
                id="edit-source"
                value={formData.source}
                onChange={(e) =>
                  setFormData({ ...formData, source: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Nutrients (per 100g)</Label>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="edit-calories" className="text-xs">
                    Calories
                  </Label>
                  <Input
                    id="edit-calories"
                    type="number"
                    value={formData.nutrients.calories}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nutrients: {
                          ...formData.nutrients,
                          calories: Number(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="edit-carbs" className="text-xs">
                    Carbs (g)
                  </Label>
                  <Input
                    id="edit-carbs"
                    type="number"
                    value={formData.nutrients.carbs_g}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nutrients: {
                          ...formData.nutrients,
                          carbs_g: Number(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="edit-protein" className="text-xs">
                    Protein (g)
                  </Label>
                  <Input
                    id="edit-protein"
                    type="number"
                    value={formData.nutrients.protein_g}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nutrients: {
                          ...formData.nutrients,
                          protein_g: Number(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="edit-fat" className="text-xs">
                    Fat (g)
                  </Label>
                  <Input
                    id="edit-fat"
                    type="number"
                    value={formData.nutrients.fat_g}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nutrients: {
                          ...formData.nutrients,
                          fat_g: Number(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="edit-fibre" className="text-xs">
                    Fibre (g)
                  </Label>
                  <Input
                    id="edit-fibre"
                    type="number"
                    value={formData.nutrients.fibre_g}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nutrients: {
                          ...formData.nutrients,
                          fibre_g: Number(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="edit-gi" className="text-xs">
                    GI
                  </Label>
                  <Input
                    id="edit-gi"
                    type="number"
                    value={formData.nutrients.gi}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nutrients: {
                          ...formData.nutrients,
                          gi: Number(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateFood} disabled={isLoading}>
              Update Food
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Batch Upload Dialog */}
      <BatchUploadDialog
        open={isBatchUploadOpen}
        onOpenChange={setIsBatchUploadOpen}
      />
    </div>
  );
}
