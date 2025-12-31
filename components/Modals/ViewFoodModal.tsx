"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  IconEdit,
  IconTrash,
  IconFlame,
  IconLeaf,
  IconMeat,
  IconDroplet,
} from "@tabler/icons-react";
import type { Food } from "@/stores/useFoodStore";

interface ViewFoodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  food: Food | null;
  onEdit?: (id: string) => void;
  onDelete?: (food: Food) => void;
}

export function ViewFoodModal({
  open,
  onOpenChange,
  food,
  onEdit,
  onDelete,
}: ViewFoodModalProps) {
  if (!food) return null;

  const getGIColor = (gi: number | null) => {
    if (gi === null) return "text-gray-600 bg-gray-100";
    if (gi <= 55) return "text-green-600 bg-green-100";
    if (gi <= 69) return "text-amber-600 bg-amber-100";
    return "text-red-600 bg-red-100";
  };

  const getGILabel = (gi: number | null) => {
    if (gi === null) return "N/A";
    if (gi <= 55) return "Low GI";
    if (gi <= 69) return "Medium GI";
    return "High GI";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-hidden flex flex-col gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-xl">{food.localName}</DialogTitle>
          <DialogDescription>{food.canonicalName}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Food Image */}
          {food.imageUrl && (
            <div className="mb-4">
              <img
                src={food.imageUrl}
                alt={food.localName}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Category & Status */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <Badge variant="outline">{food.category}</Badge>
            <Badge variant={food.deleted ? "destructive" : "default"}>
              {food.deleted ? "Deleted" : "Active"}
            </Badge>
            <Badge
              variant="secondary"
              className={getGIColor(food.nutrients.gi)}
            >
              {getGILabel(food.nutrients.gi)} ({food.nutrients.gi ?? "N/A"})
            </Badge>
          </div>

          <Separator className="my-4" />

          {/* Nutrients Grid */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">
              Nutritional Information (per 100g)
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-orange-50 dark:bg-orange-950/30 p-3">
                <IconFlame className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Calories</p>
                  <p className="font-semibold">
                    {food.nutrients.calories} kcal
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 p-3">
                <IconLeaf className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Carbs</p>
                  <p className="font-semibold">{food.nutrients.carbs_g}g</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-950/30 p-3">
                <IconMeat className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Protein</p>
                  <p className="font-semibold">{food.nutrients.protein_g}g</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 p-3">
                <IconDroplet className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Fat</p>
                  <p className="font-semibold">{food.nutrients.fat_g}g</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-green-50 dark:bg-green-950/30 p-3">
                <IconLeaf className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Fibre</p>
                  <p className="font-semibold">{food.nutrients.fibre_g}g</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 p-3">
                <div className="flex h-5 w-5 items-center justify-center rounded text-xs font-bold text-blue-500">
                  GI
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Glycemic Index
                  </p>
                  <p className="font-semibold">{food.nutrients.gi}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Portion Sizes */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Portion Sizes</h4>
            <div className="space-y-2">
              {food.portionSizes.map((portion, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <span className="font-medium text-sm">{portion.name}</span>
                  <div className="text-right text-sm">
                    <p>{portion.grams}g</p>
                    <p className="text-muted-foreground text-xs">
                      {portion.carbs_g}g carbs
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Tags */}
          {food.tags && food.tags.length > 0 && (
            <div className="space-y-2 mb-4">
              <h4 className="font-semibold text-sm">Tags</h4>
              <div className="flex flex-wrap gap-1">
                {food.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-muted/50 p-3 rounded-lg">
              <span className="text-muted-foreground text-xs">
                Affordability
              </span>
              <p className="font-semibold capitalize">{food.affordability}</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <span className="text-muted-foreground text-xs">Source</span>
              <p className="font-semibold capitalize">{food.source}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-muted/30">
          {onEdit && (
            <Button
              onClick={() => {
                onEdit(food._id);
                onOpenChange(false);
              }}
            >
              <IconEdit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(food);
                onOpenChange(false);
              }}
            >
              <IconTrash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
          {!onEdit && !onDelete && (
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
