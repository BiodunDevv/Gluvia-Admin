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

export const useImageUploadStore = create<ImageUploadState>((set, get) => ({
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

    return new Promise<string | null>((resolve) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ProfileX"
      );

      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          set({ uploadProgress: progress });
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            set({ isUploading: false, uploadProgress: 100 });
            toast.success("Image uploaded successfully!");
            resolve(data.secure_url);
          } catch {
            set({ isUploading: false, uploadProgress: 0 });
            toast.error("Failed to process upload response");
            resolve(null);
          }
        } else {
          set({ isUploading: false, uploadProgress: 0 });
          toast.error("Upload failed");
          resolve(null);
        }
      });

      xhr.addEventListener("error", () => {
        console.error("Upload error");
        toast.error("Failed to upload image");
        set({ isUploading: false, uploadProgress: 0 });
        resolve(null);
      });

      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${
          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "df4f0usnh"
        }/image/upload`
      );
      xhr.send(formData);
    });
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
