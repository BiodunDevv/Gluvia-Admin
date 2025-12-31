"use client";

import { useEffect, useState } from "react";
import { useRuleStore } from "@/stores/useRuleStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { RulesDataTable } from "@/components/AllTables/rules-data-table";
import { CreateRuleModal } from "@/components/Modals/CreateRuleModal";
import { EditRuleModal } from "@/components/Modals/EditRuleModal";
import { ViewRuleModal } from "@/components/Modals/ViewRuleModal";
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
import { Separator } from "@/components/ui/separator";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconCode,
  IconLoader2,
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
  nlTemplate?: string;
  version: number;
  appliesTo?: string[];
  createdBy?: string;
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

      {/* Rules Table */}
      <RulesDataTable
        data={filteredRules}
        isLoading={isLoading}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={() => {}}
        filterValue={filterType}
        onFilterChange={setFilterType}
        onEdit={handleEditClick}
        onDelete={handleDeleteRule}
      />

      {/* Create Rule Modal */}
      <CreateRuleModal
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleCreateRule}
        isLoading={isLoading}
      />

      {/* Edit Rule Modal */}
      <EditRuleModal
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleUpdateRule}
        isLoading={isLoading}
      />

      {/* View Rule Modal */}
      <ViewRuleModal
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        rule={viewingRule ? { ...viewingRule, id: viewingRule._id } : null}
        onEdit={() => {
          if (viewingRule) {
            setIsViewDialogOpen(false);
            handleEditClick(viewingRule);
          }
        }}
        getTypeLabel={getTypeLabel}
      />
    </div>
  );
}
