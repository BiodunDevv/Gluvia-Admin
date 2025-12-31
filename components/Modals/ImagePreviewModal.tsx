"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImagePreviewModalProps {
  imageUrl: string;
  foodName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImagePreviewModal({
  imageUrl,
  foodName,
  isOpen,
  onOpenChange,
}: ImagePreviewModalProps) {
  const [imageError, setImageError] = React.useState(false);

  React.useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-hidden flex flex-col gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>{foodName}</DialogTitle>
          <DialogDescription>Food Image Preview</DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex items-center justify-center overflow-hidden bg-muted/30 p-6">
          {imageError ? (
            <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
              <svg
                className="h-24 w-24 text-muted-foreground/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div>
                <p className="text-lg font-semibold text-muted-foreground">
                  Image not available
                </p>
                <p className="text-sm text-muted-foreground/60 mt-1">
                  The image could not be loaded
                </p>
              </div>
            </div>
          ) : (
            <img
              src={imageUrl}
              alt={foodName}
              className="max-w-full max-h-[60vh] object-contain rounded-lg"
              onError={() => setImageError(true)}
            />
          )}
        </div>

        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t bg-muted/30">
          <span className="text-xs text-muted-foreground truncate flex-1">
            {imageUrl}
          </span>
          {!imageError && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(imageUrl, "_blank")}
            >
              Open in new tab
            </Button>
          )}
          <Button size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
