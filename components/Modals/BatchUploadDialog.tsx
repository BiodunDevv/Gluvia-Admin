"use client";

import { useState, useRef } from "react";
import { useFoodStore } from "@/stores/useFoodStore";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IconFileUpload,
  IconLoader2,
  IconDownload,
  IconCheck,
  IconAlertTriangle,
  IconX,
  IconCode,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ParsedFood {
  localName: string;
  canonicalName?: string;
  category?: string;
  imageUrl?: string;
  nutrients: {
    calories: number;
    carbs_g: number;
    protein_g: number;
    fat_g: number;
    fibre_g: number;
    gi: number | null;
  };
  portionSizes: Array<{
    name: string;
    grams: number;
    carbs_g?: number;
  }>;
  affordability?: "low" | "medium" | "high";
  tags?: string[];
  source?: "manual" | "validated" | "estimated";
}

interface BatchUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BatchUploadDialog({
  open,
  onOpenChange,
}: BatchUploadDialogProps) {
  const { batchUploadFoods, isLoading } = useFoodStore();
  const [parsedFoods, setParsedFoods] = useState<ParsedFood[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [step, setStep] = useState<"upload" | "preview" | "complete">("upload");
  const [jsonInput, setJsonInput] = useState("");
  const [uploadStats, setUploadStats] = useState<{
    successCount: number;
    skippedCount?: number;
    totalCount: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const template = [
      {
        localName: "Jollof Rice",
        canonicalName: "Tomato Rice Dish",
        category: "Grains & Staples",
        imageUrl: "https://example.com/jollof-rice.jpg",
        nutrients: {
          calories: 250,
          carbs_g: 45,
          protein_g: 5.2,
          fat_g: 6.5,
          fibre_g: 2.1,
          gi: 70,
        },
        portionSizes: [
          {
            name: "Small plate",
            grams: 150,
            carbs_g: 67.5,
          },
          {
            name: "Medium plate",
            grams: 250,
            carbs_g: 112.5,
          },
          {
            name: "Large plate",
            grams: 350,
            carbs_g: 157.5,
          },
        ],
        affordability: "medium",
        tags: ["rice", "nigerian", "popular", "staple"],
        source: "validated",
      },
      {
        localName: "Eba",
        canonicalName: "Cassava Swallow",
        category: "Grains & Staples",
        imageUrl: "https://example.com/eba.jpg",
        nutrients: {
          calories: 360,
          carbs_g: 88,
          protein_g: 1.2,
          fat_g: 0.5,
          fibre_g: 1.8,
          gi: 80,
        },
        portionSizes: [
          {
            name: "Small wrap",
            grams: 100,
            carbs_g: 88,
          },
          {
            name: "Medium wrap",
            grams: 200,
            carbs_g: 176,
          },
        ],
        affordability: "low",
        tags: ["garri", "nigerian", "cassava", "staple"],
        source: "validated",
      },
    ];

    const blob = new Blob([JSON.stringify(template, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "foods-template.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Template downloaded!");
  };

  const validateFood = (food: any, index: number): string[] => {
    const errors: string[] = [];

    if (!food.localName || food.localName.trim() === "") {
      errors.push(`Row ${index + 1}: localName is required`);
    }

    if (!food.canonicalName || food.canonicalName.trim() === "") {
      errors.push(`Row ${index + 1}: canonicalName is required`);
    }

    if (!food.category || food.category.trim() === "") {
      errors.push(`Row ${index + 1}: category is required`);
    }

    if (
      !food.affordability ||
      !["low", "medium", "high"].includes(food.affordability)
    ) {
      errors.push(
        `Row ${index + 1}: affordability must be 'low', 'medium', or 'high'`
      );
    }

    if (!food.nutrients) {
      errors.push(`Row ${index + 1}: nutrients object is required`);
    } else {
      const requiredNutrients = [
        "calories",
        "carbs_g",
        "protein_g",
        "fat_g",
        "fibre_g",
        "gi",
      ];
      requiredNutrients.forEach((nutrient) => {
        if (
          food.nutrients[nutrient] === undefined ||
          food.nutrients[nutrient] === null
        ) {
          errors.push(`Row ${index + 1}: Nutrient '${nutrient}' is required`);
        } else if (
          typeof food.nutrients[nutrient] !== "number" ||
          food.nutrients[nutrient] < 0
        ) {
          errors.push(
            `Row ${index + 1}: Nutrient '${nutrient}' must be a positive number`
          );
        }
      });

      if (
        food.nutrients.gi !== undefined &&
        (typeof food.nutrients.gi !== "number" ||
          food.nutrients.gi < 0 ||
          food.nutrients.gi > 100)
      ) {
        errors.push(`Row ${index + 1}: GI must be a number between 0-100`);
      }
    }

    if (!food.portionSizes || !Array.isArray(food.portionSizes)) {
      errors.push(`Row ${index + 1}: portionSizes must be an array`);
    } else if (food.portionSizes.length === 0) {
      errors.push(`Row ${index + 1}: At least one portion size is required`);
    } else {
      food.portionSizes.forEach((portion: any, pIndex: number) => {
        if (!portion.name || portion.name.trim() === "") {
          errors.push(
            `Row ${index + 1}, Portion ${pIndex + 1}: Name is required`
          );
        }
        if (typeof portion.grams !== "number" || portion.grams <= 0) {
          errors.push(
            `Row ${index + 1}, Portion ${
              pIndex + 1
            }: grams must be a positive number`
          );
        }
        if (typeof portion.carbs_g !== "number" || portion.carbs_g < 0) {
          errors.push(
            `Row ${index + 1}, Portion ${
              pIndex + 1
            }: carbs_g must be a positive number`
          );
        }
      });
    }

    if (food.tags && !Array.isArray(food.tags)) {
      errors.push(`Row ${index + 1}: tags must be an array`);
    }

    const validSourceValues = ["manual", "validated", "estimated"];
    if (food.source && !validSourceValues.includes(food.source)) {
      errors.push(
        `Row ${index + 1}: source must be one of: ${validSourceValues.join(
          ", "
        )}`
      );
    }

    return errors;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".json")) {
      toast.error("Please upload a JSON file");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        processJsonData(content);
      } catch (error) {
        toast.error("Failed to parse file. Please check the format.");
        console.error("Parse error:", error);
      }
    };

    reader.readAsText(file);
  };

  const handleJsonPaste = () => {
    if (!jsonInput.trim()) {
      toast.error("Please paste JSON data");
      return;
    }
    processJsonData(jsonInput);
  };

  const processJsonData = (content: string) => {
    try {
      const data = JSON.parse(content);

      if (!Array.isArray(data)) {
        toast.error("Invalid JSON format. Expected an array of food items.");
        return;
      }

      const validSourceValues = ["manual", "validated", "estimated"];
      const normalizedData = data.map((food: ParsedFood) => ({
        ...food,
        source: validSourceValues.includes(food?.source ?? "")
          ? food.source
          : "validated",
      }));

      // Validate all foods
      const allErrors: string[] = [];
      normalizedData.forEach((food, index) => {
        const errors = validateFood(food, index);
        allErrors.push(...errors);
      });

      if (allErrors.length > 0) {
        setValidationErrors(allErrors);
        toast.error(`Found ${allErrors.length} validation error(s)`);
      } else {
        setParsedFoods(normalizedData);
        setValidationErrors([]);
        setStep("preview");
        toast.success(
          `Successfully parsed ${normalizedData.length} food items`
        );
      }
    } catch (error) {
      toast.error("Invalid JSON format. Please check your syntax.");
      console.error("Parse error:", error);
    }
  };

  const handleUpload = async () => {
    const result = await batchUploadFoods(parsedFoods);
    if (result && typeof result === "object") {
      setUploadStats(result);
      setStep("complete");
      setTimeout(() => {
        handleClose();
      }, 3000);
    } else if (result === true) {
      setUploadStats(null);
      setStep("complete");
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  };

  const handleClose = () => {
    setParsedFoods([]);
    setValidationErrors([]);
    setStep("upload");
    setJsonInput("");
    setUploadStats(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden flex flex-col gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>Batch Upload Foods</DialogTitle>
          <DialogDescription>
            Upload multiple food items at once using JSON format
          </DialogDescription>
        </DialogHeader>

        {/* Upload Step */}
        {step === "upload" && (
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-6">
              <Tabs defaultValue="paste" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="paste">
                    <IconCode className="mr-2 h-4 w-4" />
                    Paste JSON
                  </TabsTrigger>
                  <TabsTrigger value="file">
                    <IconFileUpload className="mr-2 h-4 w-4" />
                    Upload File
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="paste" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="json-input">Paste your JSON data</Label>
                    <Textarea
                      id="json-input"
                      placeholder='[
  {
    "localName": "Jollof Rice",
    "canonicalName": "Tomato Rice Dish",
    "category": "Grains & Staples",
    "nutrients": {
      "calories": 250,
      "carbs_g": 45,
      "protein_g": 5.2,
      "fat_g": 6.5,
      "fibre_g": 2.1,
      "gi": 70
    },
    "portionSizes": [
      {
        "name": "Medium plate",
        "grams": 250,
        "carbs_g": 112.5
      }
    ],
    "affordability": "medium",
    "tags": ["rice", "nigerian", "popular"],
    "source": "validated"
  }
]'
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      className="font-mono text-xs min-h-87.5 resize-none"
                    />
                  </div>
                  <Button onClick={handleJsonPaste} className="w-full">
                    <IconCheck className="mr-2 h-4 w-4" />
                    Parse & Validate JSON
                  </Button>
                </TabsContent>

                <TabsContent value="file" className="mt-4">
                  <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 space-y-4">
                    <IconFileUpload className="h-12 w-12 text-muted-foreground" />
                    <div className="text-center space-y-2">
                      <h3 className="font-semibold">Upload your JSON file</h3>
                      <p className="text-sm text-muted-foreground">
                        Select a .json file from your computer
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button asChild>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <IconFileUpload className="mr-2 h-4 w-4" />
                        Choose JSON File
                      </label>
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              {validationErrors.length > 0 && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <div className="flex items-start gap-2">
                    <IconAlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-red-900 mb-2">
                        Validation Errors ({validationErrors.length})
                      </h4>
                      <ul className="space-y-1 text-sm text-red-800 max-h-40 overflow-y-auto">
                        {validationErrors.slice(0, 10).map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                        {validationErrors.length > 10 && (
                          <li className="font-semibold">
                            ... and {validationErrors.length - 10} more errors
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm">Need a template?</h4>
                    <p className="text-xs text-muted-foreground">
                      Download a sample JSON file with example data
                    </p>
                  </div>
                  <Button variant="outline" onClick={downloadTemplate}>
                    <IconDownload className="mr-2 h-4 w-4" />
                    Download Template
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview Step */}
        {step === "preview" && (
          <div className="flex-1 overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/30 sticky top-0 z-10">
              <div>
                <h4 className="font-semibold">
                  Preview ({parsedFoods.length} items)
                </h4>
                <p className="text-sm text-muted-foreground">
                  Review the data before uploading
                </p>
              </div>
              <Badge variant="outline" className="text-green-600">
                <IconCheck className="mr-1 h-3 w-3" />
                Validation Passed
              </Badge>
            </div>

            <div className="flex-1 overflow-auto px-6 py-4">
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Local Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Image</TableHead>
                      <TableHead>GI</TableHead>
                      <TableHead>Calories</TableHead>
                      <TableHead>Carbs (g)</TableHead>
                      <TableHead>Protein (g)</TableHead>
                      <TableHead>Affordability</TableHead>
                      <TableHead>Portions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedFoods.slice(0, 50).map((food, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-xs">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-medium">
                          <div>{food.localName}</div>
                          <div className="text-xs text-muted-foreground">
                            {food.canonicalName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{food.category}</Badge>
                        </TableCell>
                        <TableCell>
                          {food.imageUrl ? (
                            <div className="w-12 h-12 rounded overflow-hidden bg-muted">
                              <img
                                src={food.imageUrl}
                                alt={food.localName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              No image
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{food.nutrients.gi}</TableCell>
                        <TableCell>{food.nutrients.calories}</TableCell>
                        <TableCell>{food.nutrients.carbs_g}</TableCell>
                        <TableCell>{food.nutrients.protein_g}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{food.affordability}</Badge>
                        </TableCell>
                        <TableCell>{food.portionSizes.length}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {parsedFoods.length > 50 && (
                  <div className="p-4 text-center text-sm text-muted-foreground border-t bg-muted/30">
                    Showing first 50 items. Total: {parsedFoods.length}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Complete Step */}
        {step === "complete" && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 space-y-6">
            <div className="rounded-full bg-green-100 p-4">
              <IconCheck className="h-12 w-12 text-green-600" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Upload Complete!</h3>
              <p className="text-sm text-muted-foreground">
                Your foods have been successfully processed
              </p>
            </div>

            {uploadStats && (
              <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
                <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
                  <p className="text-2xl font-bold text-green-600">
                    {uploadStats.successCount}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Uploaded</p>
                </div>
                {uploadStats.skippedCount !== undefined &&
                  uploadStats.skippedCount > 0 && (
                    <div className="bg-amber-50 rounded-lg p-4 text-center border border-amber-200">
                      <p className="text-2xl font-bold text-amber-600">
                        {uploadStats.skippedCount}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Skipped
                      </p>
                    </div>
                  )}
                <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
                  <p className="text-2xl font-bold text-blue-600">
                    {uploadStats.totalCount}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Total</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-muted/30">
          {step === "upload" && (
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          )}
          {step === "preview" && (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setStep("upload");
                  setParsedFoods([]);
                }}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button onClick={handleUpload} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <IconFileUpload className="mr-2 h-4 w-4" />
                    Upload {parsedFoods.length} Items
                  </>
                )}
              </Button>
            </>
          )}
          {step === "complete" && <Button onClick={handleClose}>Close</Button>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
