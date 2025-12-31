"use client";

import React from "react";
import {
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconEye,
  IconSearch,
  IconFilter,
} from "@tabler/icons-react";
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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

export interface Rule {
  _id: string;
  slug: string;
  title: string;
  type:
    | "constraint"
    | "scoring"
    | "substitution"
    | "portion_adjustment"
    | "alert";
  definition: any;
  nlTemplate?: string;
  version: number;
  appliesTo?: string[];
  createdBy?: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RulesDataTableProps {
  data: Rule[];
  isLoading?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearch?: () => void;
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  onEdit: (rule: Rule) => void;
  onDelete: (slug: string) => void;
}

function getTypeLabel(type: Rule["type"]): string {
  switch (type) {
    case "constraint":
      return "Constraint";
    case "scoring":
      return "Scoring";
    case "substitution":
      return "Substitution";
    case "portion_adjustment":
      return "Portion Adjustment";
    case "alert":
      return "Alert";
    default:
      return type;
  }
}

// Rule detail viewer component
function RuleDetailViewer({
  rule,
  onEdit,
  onDelete,
  isOpen,
  onOpenChange,
}: {
  rule: Rule;
  onEdit: (rule: Rule) => void;
  onDelete: (slug: string) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isMobile = useIsMobile();

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
          {rule.title}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="gap-1">
          <DrawerTitle className="text-xl">{rule.title}</DrawerTitle>
          <DrawerDescription>{rule.slug}</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {/* Type & Status */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline">{getTypeLabel(rule.type)}</Badge>
            <Badge variant={rule.deleted ? "secondary" : "default"}>
              {rule.deleted ? "Archived" : "Active"}
            </Badge>
          </div>

          <Separator />

          {/* Rule Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Rule Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <span className="text-xs text-muted-foreground">Type</span>
                  <p className="font-semibold capitalize">
                    {getTypeLabel(rule.type)}
                  </p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <span className="text-xs text-muted-foreground">Version</span>
                  <p className="font-semibold">v{rule.version}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* NL Template */}
            {rule.nlTemplate && (
              <div className="space-y-2">
                <h4 className="font-semibold">Template</h4>
                <p className="text-muted-foreground">{rule.nlTemplate}</p>
              </div>
            )}

            {rule.nlTemplate && <Separator />}

            {/* Applies To */}
            {rule.appliesTo && rule.appliesTo.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">Applies To</h4>
                <div className="flex flex-wrap gap-1">
                  {rule.appliesTo.map((item, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {rule.appliesTo && rule.appliesTo.length > 0 && <Separator />}

            {/* Definition */}
            {rule.definition && (
              <div className="space-y-2">
                <h4 className="font-semibold">Definition</h4>
                <pre className="bg-muted/50 p-3 rounded-lg text-xs overflow-auto max-h-48">
                  {JSON.stringify(rule.definition, null, 2)}
                </pre>
              </div>
            )}

            <Separator />

            {/* Metadata */}
            <div className="space-y-2">
              <h4 className="font-semibold">Metadata</h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <span className="text-muted-foreground">Created By</span>
                  <p className="font-semibold">{rule.createdBy || "System"}</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <span className="text-muted-foreground">Created</span>
                  <p className="font-semibold">
                    {new Date(rule.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DrawerFooter className="flex-row gap-2">
          <Button
            onClick={() => {
              onEdit(rule);
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
              onDelete(rule.slug);
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

export function RulesDataTable({
  data,
  isLoading = false,
  searchValue = "",
  onSearchChange,
  onSearch,
  filterValue = "all",
  onFilterChange,
  onEdit,
  onDelete,
}: RulesDataTableProps) {
  const [viewingRuleId, setViewingRuleId] = React.useState<string | null>(null);
  return (
    <div className="flex flex-col gap-4">
      {/* Search & Filter Controls */}
      {(onSearch || onSearchChange || onFilterChange) && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search rules..."
              className="pl-9"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch?.()}
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterValue} onValueChange={onFilterChange}>
              <SelectTrigger className="w-45">
                <IconFilter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="constraint">Constraint</SelectItem>
                <SelectItem value="scoring">Scoring</SelectItem>
                <SelectItem value="substitution">Substitution</SelectItem>
                <SelectItem value="portion_adjustment">
                  Portion Adjustment
                </SelectItem>
                <SelectItem value="alert">Alert</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={onSearch}>Search</Button>
          </div>
        </div>
      )}

      {/* Table with Loading State */}
      <div className="overflow-hidden rounded-lg border">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p>No rules found</p>
              {searchValue && (
                <Button
                  variant="link"
                  onClick={() => onSearchChange?.("")}
                  className="mt-2"
                >
                  Clear search
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Slug</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Version
                  </TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((rule, index) => (
                  <TableRow key={rule._id}>
                    <TableCell className="text-muted-foreground font-medium">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <RuleDetailViewer
                        rule={rule}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        isOpen={viewingRuleId === rule._id}
                        onOpenChange={(open) =>
                          setViewingRuleId(open ? rule._id : null)
                        }
                      />
                      {rule.nlTemplate && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1 max-w-xs">
                          {rule.nlTemplate}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-xs text-muted-foreground">
                      {rule.slug}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {getTypeLabel(rule.type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant={rule.deleted ? "secondary" : "default"}>
                        {rule.deleted ? "Archived" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                      v{rule.version}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <IconDotsVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setViewingRuleId(rule._id)}
                          >
                            <IconEye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(rule)}>
                            <IconEdit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDelete(rule.slug)}
                            className="text-destructive focus:text-destructive"
                          >
                            <IconTrash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
