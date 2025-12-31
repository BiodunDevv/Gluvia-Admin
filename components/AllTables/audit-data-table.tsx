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
  IconGripVertical,
  IconLayoutColumns,
  IconUser,
  IconClock,
  IconTarget,
  IconCode,
  IconSearch,
  IconLoader2,
  IconFilter,
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
import type { AuditLog } from "@/stores/useAuditStore";

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

// Get action color
function getActionColor(action: string) {
  const colors: Record<string, string> = {
    create: "bg-green-100 text-green-700 border-green-200",
    update: "bg-blue-100 text-blue-700 border-blue-200",
    delete: "bg-red-100 text-red-700 border-red-200",
    login: "bg-purple-100 text-purple-700 border-purple-200",
    logout: "bg-gray-100 text-gray-700 border-gray-200",
    seed: "bg-amber-100 text-amber-700 border-amber-200",
    revoke: "bg-orange-100 text-orange-700 border-orange-200",
  };

  const actionLower = action.toLowerCase();
  for (const key of Object.keys(colors)) {
    if (actionLower.includes(key)) return colors[key];
  }
  return "bg-gray-100 text-gray-700 border-gray-200";
}

// Audit log detail viewer component
function AuditLogDetailViewer({ log }: { log: AuditLog }) {
  const isMobile = useIsMobile();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button
          variant="link"
          className="text-foreground w-fit px-0 text-left font-medium"
        >
          {log.action}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="gap-1">
          <DrawerTitle className="text-xl">Audit Log Details</DrawerTitle>
          <DrawerDescription>ID: {log._id}</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {/* Action Badge */}
          <Badge
            variant="outline"
            className={`w-fit ${getActionColor(log.action)}`}
          >
            {log.action}
          </Badge>

          <Separator />

          {/* Who performed the action */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <IconUser className="h-4 w-4" />
              Performed By
            </h4>
            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{log.who.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{log.who.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Role</span>
                <Badge variant="outline" className="capitalize">
                  {log.who.role}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Target */}
          {log.target && (
            <>
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <IconTarget className="h-4 w-4" />
                  Target
                </h4>
                <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Collection</span>
                    <Badge variant="outline">{log.target.collection}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {log.target.id}
                    </code>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Payload */}
          {log.payload && Object.keys(log.payload).length > 0 && (
            <>
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <IconCode className="h-4 w-4" />
                  Payload
                </h4>
                <pre className="rounded-lg bg-muted p-4 text-xs overflow-x-auto max-h-64">
                  {JSON.stringify(log.payload, null, 2)}
                </pre>
              </div>
              <Separator />
            </>
          )}

          {/* Timestamp */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <IconClock className="h-4 w-4" />
              Timestamp
            </h4>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="font-medium">{formatDate(log.createdAt)}</p>
            </div>
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

// Draggable row component
function DraggableRow({ row }: { row: Row<AuditLog> }) {
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
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

// Create columns
function createColumns(): ColumnDef<AuditLog>[] {
  return [
    {
      id: "drag",
      header: () => null,
      cell: ({ row }) => <DragHandle id={row.original._id} />,
    },
    {
      id: "number",
      header: "#",
      cell: ({ row }) => (
        <div className="flex items-center justify-center text-muted-foreground font-medium">
          {row.index + 1}
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => <AuditLogDetailViewer log={row.original} />,
      enableHiding: false,
    },
    {
      accessorKey: "who.name",
      header: "Performed By",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.who.name}</p>
          <p className="text-xs text-muted-foreground">
            {row.original.who.email}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "who.role",
      header: "Role",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.who.role}
        </Badge>
      ),
    },
    {
      accessorKey: "target.collection",
      header: "Target",
      cell: ({ row }) =>
        row.original.target ? (
          <Badge variant="secondary">{row.original.target.collection}</Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      accessorKey: "createdAt",
      header: "Timestamp",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {new Date(row.original.createdAt).toLocaleString()}
        </span>
      ),
    },
  ];
}

interface AuditDataTableProps {
  data: AuditLog[];
  isLoading?: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
  actionFilter?: string;
  onActionFilterChange?: (value: string) => void;
}

export function AuditDataTable({
  data: initialData,
  isLoading,
  pagination: externalPagination,
  onPageChange,
  actionFilter,
  onActionFilterChange,
}: AuditDataTableProps) {
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

  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const columns = React.useMemo(() => createColumns(), []);

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

  // Unique actions for filter
  const uniqueActions = React.useMemo(() => {
    const actions = new Set(initialData.map((log) => log.action));
    return Array.from(actions).sort();
  }, [initialData]);

  return (
    <div className="flex flex-col gap-4">
      {/* Filter Controls */}
      {onActionFilterChange && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex items-center gap-2">
            <IconFilter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter</span>
          </div>
          <Select
            value={actionFilter || "all"}
            onValueChange={onActionFilterChange}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="All Actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              {uniqueActions.map((action) => (
                <SelectItem key={action} value={action}>
                  {action}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No audit logs found.
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
