import { create } from "zustand";
import { toast } from "sonner";

interface ImageUploadState {
  isUploading: boolean;
  uploadProgress: number;
  searchedImage: {
    imageUrl: string;
    source: string;
    searchQuery: string;
  } | null;

  // Actions
  uploadToCloudinary: (file: File) => Promise<string | null>;
  resetUpload: () => void;
  setSearchedImage: (image: ImageUploadState["searchedImage"]) => void;
  clearSearchedImage: () => void;
}

export const useImageUploadStore = create<ImageUploadState>((set) => ({
  isUploading: false,
  uploadProgress: 0,
  searchedImage: null,

  uploadToCloudinary: async (file: File) => {
    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Image must be less than 5MB");
      return null;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, and WEBP images are allowed");
      return null;
    }

    set({ isUploading: true, uploadProgress: 0 });

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ProfileX"
      );

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${
          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "df4f0usnh"
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      set({ isUploading: false, uploadProgress: 100 });
      toast.success("Image uploaded successfully!");

      return data.secure_url;
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
      set({ isUploading: false, uploadProgress: 0 });
      return null;
    }
  },

  resetUpload: () => {
    set({ isUploading: false, uploadProgress: 0 });
  },

  setSearchedImage: (image) => {
    set({ searchedImage: image });
  },

  clearSearchedImage: () => {
    set({ searchedImage: null });
  },
}));
