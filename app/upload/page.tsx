"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Check, Image, Film, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type UploadCategory = {
  path: string;
  label: string;
  items: { fileName: string; label: string }[];
};

const uploadCategories: Record<string, UploadCategory> = {
  "images/branding": {
    path: "images/branding",
    label: "Logo & Branding",
    items: [
      { fileName: "logo-primary", label: "Primary Logo" },
      { fileName: "logo-white", label: "White Logo" },
      { fileName: "logo-dark", label: "Dark Logo" },
      { fileName: "logo-icon", label: "Logo Icon Only" },
      { fileName: "favicon", label: "Favicon" },
    ],
  },
  "images/hero": {
    path: "images/hero",
    label: "Hero Section",
    items: [
      { fileName: "hero-burger", label: "Hero Burger Image" },
      { fileName: "hero-bg", label: "Hero Background" },
    ],
  },
  "images/burgers": {
    path: "images/burgers",
    label: "Burgers",
    items: [
      { fileName: "cheese-burger", label: "Cheese Burger" },
      { fileName: "double-cheese-burger", label: "Double Cheese Burger" },
      { fileName: "jalapeno-cheese-burger", label: "Jalapeño Cheese Burger" },
    ],
  },
  "images/chicken": {
    path: "images/chicken",
    label: "Chicken",
    items: [
      { fileName: "nashville-hot", label: "Nashville Hot Chicken" },
      { fileName: "buffalo-ranch", label: "Buffalo Ranch Chicken" },
      { fileName: "sweet-chili", label: "Sweet Chili Chicken" },
    ],
  },
  "images/sides": {
    path: "images/sides",
    label: "Sides",
    items: [
      { fileName: "fries", label: "Fries" },
      { fileName: "loaded-beef-fries", label: "Loaded Beef Fries" },
      { fileName: "loaded-chicken-fries", label: "Loaded Chicken Fries" },
      { fileName: "hot-tenders", label: "Hot Tenders" },
      { fileName: "buttermilk-biscuit", label: "Buttermilk Biscuit" },
    ],
  },
  "images/drinks": {
    path: "images/drinks",
    label: "Drinks",
    items: [
      { fileName: "soft-drinks", label: "Soft Drinks" },
      { fileName: "vanilla-shake", label: "Vanilla Milkshake" },
      { fileName: "nutella-shake", label: "Nutella Milkshake" },
      { fileName: "strawberry-shake", label: "Strawberry Milkshake" },
      { fileName: "oreo-shake", label: "Oreo Milkshake" },
    ],
  },
  "images/meals": {
    path: "images/meals",
    label: "Combo Meals",
    items: [
      { fileName: "cheese-burger-meal", label: "Cheese Burger Meal" },
      { fileName: "double-cheese-burger-meal", label: "Double Cheese Burger Meal" },
      { fileName: "jalapeno-burger-meal", label: "Jalapeño Burger Meal" },
      { fileName: "nashville-hot-meal", label: "Nashville Hot Chicken Meal" },
      { fileName: "buffalo-ranch-meal", label: "Buffalo Ranch Chicken Meal" },
      { fileName: "sweet-chili-meal", label: "Sweet Chili Chicken Meal" },
      { fileName: "loaded-fries-combo", label: "Loaded Fries Combo" },
      { fileName: "tenders-meal", label: "Hot Tenders Meal" },
    ],
  },
  "images/restaurant": {
    path: "images/restaurant",
    label: "Restaurant",
    items: [
      { fileName: "interior", label: "Interior" },
      { fileName: "exterior", label: "Exterior" },
      { fileName: "kitchen", label: "Kitchen" },
    ],
  },
  "images/history": {
    path: "images/history",
    label: "History",
    items: [
      { fileName: "lionel-sternberger", label: "Lionel Sternberger Photo" },
    ],
  },
  "videos": {
    path: "videos",
    label: "Videos",
    items: [
      { fileName: "hero-video", label: "Hero Video" },
      { fileName: "burger-making", label: "Burger Making Process" },
    ],
  },
};

export default function UploadPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("images/branding");
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadedItems, setUploadedItems] = useState<Set<string>>(new Set());
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    console.log("File selected:", file.name);
    setFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !selectedItem) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", selectedCategory);
    formData.append("fileName", selectedItem);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setUploadedItems(new Set([...uploadedItems, `${selectedCategory}/${selectedItem}`]));
        setFile(null);
        setPreview("");
        setSelectedItem("");
        alert(`Upload successful! File available at: ${data.url}`);
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (error) {
      alert("Upload error: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const category = uploadCategories[selectedCategory];
  
  console.log("Current state:", { file, selectedItem, uploading });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Upload Media for Steiny&apos;s</h1>

          {/* Category Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Category
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(uploadCategories).map(([key, cat]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedCategory(key);
                    setSelectedItem("");
                    setFile(null);
                    setPreview("");
                  }}
                  className={cn(
                    "px-4 py-3 rounded-lg font-medium transition-all",
                    selectedCategory === key
                      ? "bg-brand-green text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Item Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Item to Upload
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {category.items.map((item) => {
                const isUploaded = uploadedItems.has(`${selectedCategory}/${item.fileName}`);
                return (
                  <button
                    key={item.fileName}
                    onClick={() => setSelectedItem(item.fileName)}
                    disabled={isUploaded}
                    className={cn(
                      "px-4 py-3 rounded-lg font-medium transition-all text-left flex items-center justify-between",
                      selectedItem === item.fileName
                        ? "bg-brand-green text-white"
                        : isUploaded
                        ? "bg-green-100 text-green-700 cursor-not-allowed"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    <span>{item.label}</span>
                    {isUploaded && <Check className="w-5 h-5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* File Upload Area */}
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Upload File
              </label>
              
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 text-center transition-all",
                  dragActive
                    ? "border-brand-green bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
                )}
              >
                {preview ? (
                  <div className="relative">
                    {selectedCategory === "videos" ? (
                      <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                        <Film className="w-24 h-24 text-gray-400" />
                      </div>
                    ) : (
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg"
                      />
                    )}
                    <button
                      onClick={() => {
                        setFile(null);
                        setPreview("");
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <p className="mt-4 text-sm text-gray-600">{file?.name}</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Drag and drop your file here, or click to browse
                    </p>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept={selectedCategory === "videos" ? "video/*" : "image/*"}
                      className="hidden"
                      id="file-input"
                    />
                    <label
                      htmlFor="file-input"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-dark transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      Choose File
                    </label>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* Upload Button */}
          {file && selectedItem && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleUpload}
              disabled={uploading}
              className={cn(
                "w-full py-4 rounded-xl font-bold text-white transition-all",
                uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-brand-green hover:bg-brand-dark"
              )}
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading...
                </span>
              ) : (
                "Upload to S3"
              )}
            </motion.button>
          )}

          {/* Progress Overview */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Upload Progress</h3>
            <div className="text-sm text-gray-600">
              {uploadedItems.size} of{" "}
              {Object.values(uploadCategories).reduce((acc, cat) => acc + cat.items.length, 0)}{" "}
              items uploaded
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-brand-green h-2 rounded-full transition-all"
                style={{
                  width: `${
                    (uploadedItems.size /
                      Object.values(uploadCategories).reduce(
                        (acc, cat) => acc + cat.items.length,
                        0
                      )) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}