"use client";

import { useEffect, useState } from "react";
import { useRuleStore } from "@/stores/useRuleStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconLoader2,
  IconDotsVertical,
  IconSearch,
  IconFilter,
  IconEye,
  IconCode,
} from "@tabler/icons-react";

interface Rule {
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
  nlTemplate: string;
  version: number;
  appliesTo: string[];
  createdBy: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Rule detail drawer component
function RuleDetailDrawer({
  rule,
  onEdit,
  onDelete,
}: {
  rule: Rule;
  onEdit: (rule: Rule) => void;
  onDelete: (slug: string) => void;
}) {
  const isMobile = useIsMobile();

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      constraint: "Constraint",
      scoring: "Scoring",
      substitution: "Substitution",
      portion_adjustment: "Portion Adjustment",
      alert: "Alert",
    };
    return labels[type] || type;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button
          variant="link"
          className="text-foreground w-fit px-0 text-left font-medium hover:underline"
        >
          {rule.title}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-xl">{rule.title}</DrawerTitle>
          <DrawerDescription className="font-mono text-xs">
            {rule.slug}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Type</Label>
                <p className="font-medium">{getTypeLabel(rule.type)}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Version</Label>
                <p className="font-medium">v{rule.version}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Status</Label>
                <Badge variant={rule.deleted ? "secondary" : "default"}>
                  {rule.deleted ? "Archived" : "Active"}
                </Badge>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Created</Label>
                <p className="text-sm">{formatDate(rule.createdAt)}</p>
              </div>
            </div>

            <Separator />

            {/* Description */}
            {rule.nlTemplate && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Description
                </Label>
                <p className="text-sm leading-relaxed bg-muted/50 p-3 rounded-lg">
                  {rule.nlTemplate}
                </p>
              </div>
            )}

            {/* Applies To */}
            {rule.appliesTo && rule.appliesTo.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Applies To
                </Label>
                <div className="flex flex-wrap gap-2">
                  {rule.appliesTo.map((tag, idx) => (
                    <Badge key={idx} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Definition */}
            {rule.definition && Object.keys(rule.definition).length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground flex items-center gap-2">
                  <IconCode className="h-3 w-3" />
                  Configuration
                </Label>
                <pre className="bg-muted p-3 rounded-lg text-xs overflow-auto max-h-48 font-mono">
                  {JSON.stringify(rule.definition, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        <DrawerFooter className="flex-row gap-2 border-t pt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onEdit(rule)}
          >
            <IconEdit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            className="flex-1 text-destructive hover:text-destructive"
            onClick={() => onDelete(rule.slug)}
          >
            <IconTrash className="mr-2 h-4 w-4" />
            Delete
          </Button>
          <DrawerClose asChild>
            <Button variant="secondary" className="flex-1">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default function RulesPage() {
  const { rules, isLoading, fetchRules, createRule, updateRule, deleteRule } =
    useRuleStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [viewingRule, setViewingRule] = useState<Rule | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    type: "constraint" as Rule["type"],
    nlTemplate: "",
    appliesTo: "",
  });

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const resetForm = () => {
    setFormData({
      slug: "",
      title: "",
      type: "constraint",
      nlTemplate: "",
      appliesTo: "",
    });
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    const ruleData = {
      ...formData,
      definition: {},
      appliesTo: formData.appliesTo
        ? formData.appliesTo.split(",").map((t) => t.trim())
        : [],
    };
    const success = await createRule(ruleData);
    if (success) {
      setIsCreateDialogOpen(false);
      resetForm();
    }
  };

  const handleEditClick = (rule: Rule) => {
    setEditingRule(rule);
    setFormData({
      slug: rule.slug,
      title: rule.title,
      type: rule.type,
      nlTemplate: rule.nlTemplate || "",
      appliesTo: rule.appliesTo?.join(", ") || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule) return;
    const ruleData = {
      title: formData.title,
      type: formData.type,
      nlTemplate: formData.nlTemplate,
      appliesTo: formData.appliesTo
        ? formData.appliesTo.split(",").map((t) => t.trim())
        : [],
    };
    const success = await updateRule(editingRule.slug, ruleData);
    if (success) {
      setIsEditDialogOpen(false);
      setEditingRule(null);
      resetForm();
    }
  };

  const handleDeleteRule = async (slug: string) => {
    if (confirm("Are you sure you want to delete this rule?")) {
      await deleteRule(slug);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      constraint: "Constraint",
      scoring: "Scoring",
      substitution: "Substitution",
      portion_adjustment: "Portion",
      alert: "Alert",
    };
    return labels[type] || type;
  };

  // Filter rules
  const filteredRules = rules?.filter((rule) => {
    const matchesType = filterType === "all" || rule.type === filterType;
    const matchesSearch =
      !searchQuery ||
      rule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Stats
  const totalRules = rules?.length || 0;

  return (
    <div className="space-y-6 px-4 lg:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Rule Templates
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage dietary rules and meal planning guidelines
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <IconPlus className="h-4 w-4" />
          Add Rule
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Rules</CardDescription>
            <CardTitle className="text-3xl">{totalRules}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-3xl">
              {rules?.filter((r) => !r.deleted).length || 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Constraints</CardDescription>
            <CardTitle className="text-3xl">
              {rules?.filter((r) => r.type === "constraint").length || 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Other Types</CardDescription>
            <CardTitle className="text-3xl">
              {rules?.filter((r) => r.type !== "constraint").length || 0}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search rules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
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
          </div>
        </CardContent>
      </Card>

      {/* Rules Table */}
      <Card>
        <CardContent className="p-0">
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
          ) : !filteredRules || filteredRules.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p>No rules found</p>
                {searchQuery && (
                  <Button
                    variant="link"
                    onClick={() => setSearchQuery("")}
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
                    <TableHead className="hidden sm:table-cell">
                      Status
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Version
                    </TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRules.map((rule, index) => (
                    <TableRow key={rule._id}>
                      <TableCell className="text-muted-foreground font-medium">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <RuleDetailDrawer
                          rule={rule as Rule}
                          onEdit={handleEditClick}
                          onDelete={handleDeleteRule}
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
                              onClick={() => {
                                setViewingRule(rule as Rule);
                                setIsViewDialogOpen(true);
                              }}
                            >
                              <IconEye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditClick(rule as Rule)}
                            >
                              <IconEdit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteRule(rule.slug)}
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
        </CardContent>
      </Card>

      {/* Create Rule Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Rule</DialogTitle>
            <DialogDescription>
              Add a new rule template to the system
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateRule} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  placeholder="max-gi-constraint"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: Rule["type"]) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="constraint">Constraint</SelectItem>
                    <SelectItem value="scoring">Scoring</SelectItem>
                    <SelectItem value="substitution">Substitution</SelectItem>
                    <SelectItem value="portion_adjustment">
                      Portion Adjustment
                    </SelectItem>
                    <SelectItem value="alert">Alert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Maximum Glycemic Index"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nlTemplate">Description</Label>
              <Textarea
                id="nlTemplate"
                placeholder="Foods with GI above {threshold} are not allowed"
                value={formData.nlTemplate}
                onChange={(e) =>
                  setFormData({ ...formData, nlTemplate: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="appliesTo">Applies To (comma-separated)</Label>
              <Input
                id="appliesTo"
                placeholder="diabetes, weight-loss"
                value={formData.appliesTo}
                onChange={(e) =>
                  setFormData({ ...formData, appliesTo: e.target.value })
                }
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Rule"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Rule Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Rule</DialogTitle>
            <DialogDescription>
              Update the rule template details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateRule} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-slug">Slug</Label>
                <Input
                  id="edit-slug"
                  value={formData.slug}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: Rule["type"]) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="constraint">Constraint</SelectItem>
                    <SelectItem value="scoring">Scoring</SelectItem>
                    <SelectItem value="substitution">Substitution</SelectItem>
                    <SelectItem value="portion_adjustment">
                      Portion Adjustment
                    </SelectItem>
                    <SelectItem value="alert">Alert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-nlTemplate">Description</Label>
              <Textarea
                id="edit-nlTemplate"
                value={formData.nlTemplate}
                onChange={(e) =>
                  setFormData({ ...formData, nlTemplate: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-appliesTo">
                Applies To (comma-separated)
              </Label>
              <Input
                id="edit-appliesTo"
                value={formData.appliesTo}
                onChange={(e) =>
                  setFormData({ ...formData, appliesTo: e.target.value })
                }
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Rule"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Rule Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {viewingRule && (
            <>
              <DialogHeader className="pb-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <DialogTitle className="text-2xl">
                        {viewingRule.title}
                      </DialogTitle>
                      <DialogDescription className="font-mono text-xs">
                        {viewingRule.slug}
                      </DialogDescription>
                    </div>
                    <Badge
                      variant={viewingRule.deleted ? "secondary" : "default"}
                    >
                      {viewingRule.deleted ? "Archived" : "Active"}
                    </Badge>
                  </div>
                </div>
              </DialogHeader>

              <Separator />

              <div className="space-y-6">
                {/* Overview Section */}
                <div>
                  <h3 className="text-sm font-semibold mb-4">Overview</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1 bg-muted/40 p-3 rounded-lg">
                      <Label className="text-xs text-muted-foreground">
                        Type
                      </Label>
                      <p className="font-medium text-sm">
                        {getTypeLabel(viewingRule.type)}
                      </p>
                    </div>
                    <div className="space-y-1 bg-muted/40 p-3 rounded-lg">
                      <Label className="text-xs text-muted-foreground">
                        Version
                      </Label>
                      <p className="font-medium text-sm">
                        v{viewingRule.version}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                {viewingRule.nlTemplate && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Description</h3>
                    <p className="text-sm leading-relaxed bg-muted/40 p-3 rounded-lg border border-muted">
                      {viewingRule.nlTemplate}
                    </p>
                  </div>
                )}

                {/* Applies To Section */}
                {viewingRule.appliesTo && viewingRule.appliesTo.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3">Applies To</h3>
                    <div className="flex flex-wrap gap-2">
                      {viewingRule.appliesTo.map((tag, idx) => (
                        <Badge key={idx} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Configuration Section */}
                {viewingRule.definition &&
                  Object.keys(viewingRule.definition).length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <IconCode className="h-4 w-4" />
                        Configuration
                      </h3>
                      <pre className="bg-muted/60 p-4 rounded-lg text-xs overflow-auto max-h-64 font-mono border border-muted">
                        {JSON.stringify(viewingRule.definition, null, 2)}
                      </pre>
                    </div>
                  )}
              </div>

              <Separator />

              <DialogFooter className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    handleEditClick(viewingRule);
                  }}
                >
                  <IconEdit className="mr-2 h-4 w-4" />
                  Edit Rule
                </Button>
                <Button onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
