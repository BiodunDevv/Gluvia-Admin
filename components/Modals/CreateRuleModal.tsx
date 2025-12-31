"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { IconLoader2 } from "@tabler/icons-react";

type RuleType =
  | "constraint"
  | "scoring"
  | "substitution"
  | "portion_adjustment"
  | "alert";

interface CreateRuleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    slug: string;
    type: RuleType;
    title: string;
    nlTemplate: string;
    appliesTo: string;
  };
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export function CreateRuleModal({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  isLoading,
}: CreateRuleModalProps) {
  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-hidden flex flex-col gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>Create New Rule</DialogTitle>
          <DialogDescription>
            Add a new rule template to the system
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleFormSubmit}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>
                    Slug <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    placeholder="max-gi-constraint"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel>
                    Type <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Select
                    value={formData.type}
                    onValueChange={(value: RuleType) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="constraint">Constraint</SelectItem>
                        <SelectItem value="scoring">Scoring</SelectItem>
                        <SelectItem value="substitution">
                          Substitution
                        </SelectItem>
                        <SelectItem value="portion_adjustment">
                          Portion Adjustment
                        </SelectItem>
                        <SelectItem value="alert">Alert</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Field>
                <FieldLabel>
                  Title <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  placeholder="Maximum Glycemic Index"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </Field>

              <Field>
                <FieldLabel>Description</FieldLabel>
                <Textarea
                  placeholder="Foods with GI above {threshold} are not allowed"
                  value={formData.nlTemplate}
                  onChange={(e) =>
                    setFormData({ ...formData, nlTemplate: e.target.value })
                  }
                  rows={3}
                />
              </Field>

              <Field>
                <FieldLabel>Applies To</FieldLabel>
                <Input
                  placeholder="diabetes, weight-loss"
                  value={formData.appliesTo}
                  onChange={(e) =>
                    setFormData({ ...formData, appliesTo: e.target.value })
                  }
                />
                <span className="text-xs text-muted-foreground">
                  Comma-separated list of conditions
                </span>
              </Field>
            </FieldGroup>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-muted/30">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
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
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
