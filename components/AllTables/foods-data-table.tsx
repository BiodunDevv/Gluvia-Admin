"use client";

import * as React from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconEdit,
  IconTrash,
  IconEye,
  IconFlame,
  IconLeaf,
  IconMeat,
  IconDroplet,
  IconSearch,
  IconLoader2,
} from "@tabler/icons-react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";

import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Food } from "@/stores/useFoodStore";
import { ImagePreviewModal } from "@/components/Modals/ImagePreviewModal";

// Drag handle component
function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({ id });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

// Food detail viewer component
function FoodDetailViewer({
  food,
  onEdit,
  onDelete,
  isOpen,
  onOpenChange,
}: {
  food: Food;
  onEdit: (id: string) => void;
  onDelete: (food: Food) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isMobile = useIsMobile();

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
    <Drawer
      direction={isMobile ? "bottom" : "right"}
      open={isOpen}
      onOpenChange={onOpenChange}
    >
      <DrawerTrigger asChild>
        <Button
          variant="link"
          className="text-foreground w-fit px-0 text-left font-medium"
        >
          {food.localName}
        </Button>
      </DrawerTrigger>
      <DrawerContent
        className={isMobile ? "max-h-[90vh]" : "h-screen w-full sm:max-w-lg"}
      >
        <DrawerHeader className="gap-1">
          <DrawerTitle className="text-xl">{food.localName}</DrawerTitle>
          <DrawerDescription>{food.canonicalName}</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-4 text-sm">
          {/* Food Image */}
          {food.imageUrl && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted border">
              <img
                src={food.imageUrl}
                alt={food.localName}
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    parent.classList.add(
                      "flex",
                      "items-center",
                      "justify-center"
                    );
                    parent.innerHTML = `<div class="flex flex-col items-center justify-center gap-2 text-center p-6"><svg class="h-16 w-16 text-muted-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><span class="text-sm font-medium text-muted-foreground">${food.localName}</span><span class="text-xs text-muted-foreground/60">Image not available</span></div>`;
                  }
                }}
              />
            </div>
          )}

          {/* Category & Status */}
          <div className="flex items-center gap-2 flex-wrap">
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

          <Separator />

          {/* Nutrients Grid */}
          <div className="space-y-3">
            <h4 className="font-semibold">
              Nutritional Information (per 100g)
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-orange-50 p-3">
                <IconFlame className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Calories</p>
                  <p className="font-semibold">
                    {food.nutrients.calories} kcal
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3">
                <IconLeaf className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Carbs</p>
                  <p className="font-semibold">{food.nutrients.carbs_g}g</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3">
                <IconMeat className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Protein</p>
                  <p className="font-semibold">{food.nutrients.protein_g}g</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-yellow-50 p-3">
                <IconDroplet className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Fat</p>
                  <p className="font-semibold">{food.nutrients.fat_g}g</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3">
                <IconLeaf className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Fibre</p>
                  <p className="font-semibold">{food.nutrients.fibre_g}g</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3">
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

          <Separator />

          {/* Portion Sizes */}
          <div className="space-y-3">
            <h4 className="font-semibold">Portion Sizes</h4>
            <div className="space-y-2">
              {food.portionSizes.map((portion, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <span className="font-medium">{portion.name}</span>
                  <div className="text-right text-sm">
                    <p>{portion.grams}g</p>
                    <p className="text-muted-foreground">
                      {portion.carbs_g}g carbs
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Tags */}
          {food.tags && food.tags.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Tags</h4>
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
              <span className="text-muted-foreground">Affordability</span>
              <p className="font-semibold capitalize">{food.affordability}</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <span className="text-muted-foreground">Source</span>
              <p className="font-semibold capitalize">{food.source}</p>
            </div>
          </div>
        </div>
        <DrawerFooter className="flex-row gap-2">
          <Button
            onClick={() => {
              onEdit(food._id);
              onOpenChange?.(false);
            }}
            className="flex-1"
          >
            <IconEdit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onDelete(food);
              onOpenChange?.(false);
            }}
            className="flex-1"
          >
            <IconTrash className="mr-2 h-4 w-4" />
            Delete
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

// Draggable row component
function DraggableRow({
  row,
  onEdit,
  onDelete,
}: {
  row: Row<Food>;
  onEdit: (id: string) => void;
  onDelete: (food: Food) => void;
}) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original._id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, {
            ...cell.getContext(),
            onEdit,
            onDelete,
          })}
        </TableCell>
      ))}
    </TableRow>
  );
}

// Create columns factory function
function createColumns(
  onEdit: (id: string) => void,
  onDelete: (food: Food) => void,
  viewingFoodId: string | null,
  onViewingFoodIdChange: (id: string | null) => void
): ColumnDef<Food>[] {
  return [
    {
      id: "drag",
      header: () => null,
      cell: ({ row }) => <DragHandle id={row.original._id} />,
    },
    {
      id: "number",
      header: () => <div className="text-center">#</div>,
      cell: ({ row }) => (
        <div className="text-center text-muted-foreground font-medium">
          {row.index + 1}
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "localName",
      header: "Name",
      cell: ({ row }) => (
        <FoodDetailViewer
          food={row.original}
          onEdit={onEdit}
          onDelete={onDelete}
          isOpen={viewingFoodId === row.original._id}
          onOpenChange={(open) =>
            onViewingFoodIdChange(open ? row.original._id : null)
          }
        />
      ),
      enableHiding: false,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-muted-foreground">
          {row.original.category}
        </Badge>
      ),
    },
    {
      accessorKey: "nutrients.gi",
      header: "GI",
      cell: ({ row }) => {
        const gi = row.original.nutrients.gi;
        const getGIColor = () => {
          if (gi === null) return "bg-gray-100 text-gray-700";
          if (gi <= 55) return "bg-green-100 text-green-700";
          if (gi <= 69) return "bg-amber-100 text-amber-700";
          return "bg-red-100 text-red-700";
        };
        return (
          <Badge variant="secondary" className={getGIColor()}>
            {gi ?? "N/A"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "nutrients.calories",
      header: () => <div className="text-right">Calories</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {row.original.nutrients.calories}{" "}
          <span className="text-muted-foreground text-xs">kcal</span>
        </div>
      ),
    },
    {
      accessorKey: "nutrients.carbs_g",
      header: () => <div className="text-right">Carbs</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {row.original.nutrients.carbs_g}
          <span className="text-muted-foreground text-xs">g</span>
        </div>
      ),
    },
    {
      accessorKey: "nutrients.protein_g",
      header: () => <div className="text-right">Protein</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {row.original.nutrients.protein_g}
          <span className="text-muted-foreground text-xs">g</span>
        </div>
      ),
    },
    {
      accessorKey: "affordability",
      header: "Affordability",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={
            row.original.affordability === "low"
              ? "border-green-200 bg-green-50 text-green-700"
              : row.original.affordability === "medium"
              ? "border-amber-200 bg-amber-50 text-amber-700"
              : "border-red-200 bg-red-50 text-red-700"
          }
        >
          {row.original.affordability}
        </Badge>
      ),
    },
    {
      accessorKey: "deleted",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.deleted ? "destructive" : "default"}>
          {row.original.deleted ? "Deleted" : "Active"}
        </Badge>
      ),
    },
    {
      id: "image",
      header: "Image",
      cell: ({ row }) => {
        const food = row.original;
        const [isImageModalOpen, setIsImageModalOpen] = React.useState(false);
        const [imageStatus, setImageStatus] = React.useState<
          "loading" | "valid" | "invalid"
        >("loading");

        // Check if image URL is valid
        React.useEffect(() => {
          if (!food.imageUrl || food.imageUrl === "") {
            setImageStatus("invalid");
            return;
          }

          // Check for placeholder images
          if (food.imageUrl.includes("via.placeholder.com")) {
            setImageStatus("invalid");
            return;
          }

          // Validate image by loading it
          const img = new Image();
          img.onload = () => setImageStatus("valid");
          img.onerror = () => setImageStatus("invalid");
          img.src = food.imageUrl;
        }, [food.imageUrl]);

        if (
          !food.imageUrl ||
          food.imageUrl === "" ||
          imageStatus === "invalid"
        ) {
          return (
            <span className="text-xs text-muted-foreground">No image</span>
          );
        }

        if (imageStatus === "loading") {
          return (
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-muted/50">
              <IconLoader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          );
        }

        return (
          <>
            <button
              onClick={() => setIsImageModalOpen(true)}
              className="relative group w-10 h-10 rounded-md overflow-hidden border border-border hover:border-primary/50 transition-all cursor-pointer"
            >
              <img
                src={food.imageUrl}
                alt={food.localName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                <IconEye className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
            <ImagePreviewModal
              imageUrl={food.imageUrl}
              foodName={food.localName}
              isOpen={isImageModalOpen}
              onOpenChange={setIsImageModalOpen}
            />
          </>
        );
      },
      enableSorting: false,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onEdit(row.original._id)}>
              <IconEdit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onViewingFoodIdChange(row.original._id)}
            >
              <IconEye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(row.original)}
            >
              <IconTrash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}

interface FoodsDataTableProps {
  data: Food[];
  isLoading?: boolean;
  onEdit: (id: string) => void;
  onDelete: (food: Food) => void;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
  // Search and filter props
  onSearch?: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  categoryValue?: string;
  onCategoryChange?: (value: string) => void;
}

export function FoodsDataTable({
  data: initialData,
  isLoading,
  onEdit,
  onDelete,
  pagination: externalPagination,
  onPageChange,
  onSearch,
  searchValue,
  onSearchChange,
  categoryValue,
  onCategoryChange,
}: FoodsDataTableProps) {
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const [viewingFoodId, setViewingFoodId] = React.useState<string | null>(null);

  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const columns = React.useMemo(
    () => createColumns(onEdit, onDelete, viewingFoodId, setViewingFoodId),
    [onEdit, onDelete, viewingFoodId]
  );

  // Update data when props change
  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ _id }) => _id) || [],
    [data]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: externalPagination ? undefined : pagination,
    },
    getRowId: (row) => row._id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: externalPagination
      ? undefined
      : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: !!externalPagination,
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search & Filter Controls */}
      {(onSearch || onSearchChange || onCategoryChange) && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search foods..."
              className="pl-9"
              value={searchValue || ""}
              onChange={(e) => onSearchChange?.(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch?.()}
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={categoryValue || "all"}
              onValueChange={(v) => onCategoryChange?.(v)}
            >
              <SelectTrigger className="w-37.5">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Grains & Staples">
                  Grains & Staples
                </SelectItem>
                <SelectItem value="Protein Foods">Protein Foods</SelectItem>
                <SelectItem value="Fruits & Vegetables">
                  Fruits & Vegetables
                </SelectItem>
                <SelectItem value="Soups & Stews">Soups & Stews</SelectItem>
                <SelectItem value="Snacks">Snacks</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={onSearch}>Search</Button>
          </div>
        </div>
      )}

      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {externalPagination?.total || table.getFilteredRowModel().rows.length}{" "}
          row(s) selected
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <IconLayoutColumns className="mr-2 h-4 w-4" />
              Columns
              <IconChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== "undefined" &&
                  column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id.replace(/[._]/g, " ")}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table with Loading State */}
      <div className="overflow-hidden rounded-lg border">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <IconLoader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow
                        key={row.id}
                        row={row}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No foods found. Create your first food item!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t pt-4">
        <div className="text-muted-foreground text-sm order-2 sm:order-1">
          Showing{" "}
          {externalPagination
            ? `${
                (externalPagination.page - 1) * externalPagination.limit + 1
              } to ${Math.min(
                externalPagination.page * externalPagination.limit,
                externalPagination.total
              )} of ${externalPagination.total}`
            : `${pagination.pageIndex * pagination.pageSize + 1} to ${Math.min(
                (pagination.pageIndex + 1) * pagination.pageSize,
                data.length
              )} of ${data.length}`}{" "}
          results
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-2 order-1 sm:order-2">
          {!externalPagination && (
            <div className="flex items-center gap-2">
              <Label
                htmlFor="rows-per-page"
                className="text-sm font-medium whitespace-nowrap"
              >
                Rows per page
              </Label>
              <Select
                value={`${pagination.pageSize}`}
                onValueChange={(value) => {
                  setPagination((prev) => ({
                    ...prev,
                    pageSize: Number(value),
                  }));
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue placeholder={pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex items-center gap-1 justify-between sm:justify-start">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() =>
                externalPagination ? onPageChange?.(1) : table.setPageIndex(0)
              }
              disabled={
                externalPagination
                  ? externalPagination.page === 1
                  : !table.getCanPreviousPage()
              }
              title="First page"
            >
              <IconChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() =>
                externalPagination
                  ? onPageChange?.(externalPagination.page - 1)
                  : table.previousPage()
              }
              disabled={
                externalPagination
                  ? externalPagination.page === 1
                  : !table.getCanPreviousPage()
              }
              title="Previous page"
            >
              <IconChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-2 text-sm font-medium min-w-24 text-center">
              Page{" "}
              {externalPagination
                ? externalPagination.page
                : pagination.pageIndex + 1}{" "}
              of{" "}
              {externalPagination
                ? externalPagination.totalPages
                : table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() =>
                externalPagination
                  ? onPageChange?.(externalPagination.page + 1)
                  : table.nextPage()
              }
              disabled={
                externalPagination
                  ? externalPagination.page === externalPagination.totalPages
                  : !table.getCanNextPage()
              }
              title="Next page"
            >
              <IconChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() =>
                externalPagination
                  ? onPageChange?.(externalPagination.totalPages)
                  : table.setPageIndex(table.getPageCount() - 1)
              }
              disabled={
                externalPagination
                  ? externalPagination.page === externalPagination.totalPages
                  : !table.getCanNextPage()
              }
              title="Last page"
            >
              <IconChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
