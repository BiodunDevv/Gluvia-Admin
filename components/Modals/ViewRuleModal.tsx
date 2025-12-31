"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { IconCode, IconEdit } from "@tabler/icons-react";

interface Rule {
  id: string;
  slug: string;
  type: string;
  title: string;
  nlTemplate?: string;
  appliesTo?: string[];
  definition?: Record<string, any>;
  version: number;
  deleted: boolean;
}

interface ViewRuleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule: Rule | null;
  onEdit: () => void;
  getTypeLabel: (type: string) => string;
}

export function ViewRuleModal({
  open,
  onOpenChange,
  rule,
  onEdit,
  getTypeLabel,
}: ViewRuleModalProps) {
  if (!rule) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-hidden flex flex-col gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-1">
              <DialogTitle className="text-xl">{rule.title}</DialogTitle>
              <DialogDescription className="font-mono text-xs">
                {rule.slug}
              </DialogDescription>
            </div>
            <Badge variant={rule.deleted ? "secondary" : "default"}>
              {rule.deleted ? "Archived" : "Active"}
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Overview Section */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Overview</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1 bg-muted/40 p-3 rounded-lg">
                <span className="text-xs text-muted-foreground">Type</span>
                <p className="font-medium text-sm">{getTypeLabel(rule.type)}</p>
              </div>
              <div className="space-y-1 bg-muted/40 p-3 rounded-lg">
                <span className="text-xs text-muted-foreground">Version</span>
                <p className="font-medium text-sm">v{rule.version}</p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          {rule.nlTemplate && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Description</h3>
              <p className="text-sm leading-relaxed bg-muted/40 p-3 rounded-lg border border-muted">
                {rule.nlTemplate}
              </p>
            </div>
          )}

          {/* Applies To Section */}
          {rule.appliesTo && rule.appliesTo.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3">Applies To</h3>
              <div className="flex flex-wrap gap-2">
                {rule.appliesTo.map((tag, idx) => (
                  <Badge key={idx} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Configuration Section */}
          {rule.definition && Object.keys(rule.definition).length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <IconCode className="h-4 w-4" />
                Configuration
              </h3>
              <pre className="bg-muted/60 p-4 rounded-lg text-xs overflow-auto max-h-64 font-mono border border-muted">
                {JSON.stringify(rule.definition, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-muted/30">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              onEdit();
            }}
          >
            <IconEdit className="mr-2 h-4 w-4" />
            Edit Rule
          </Button>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
