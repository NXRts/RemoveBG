"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileImage, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  className?: string;
}

export default function Dropzone({ onFileSelect, className }: DropzoneProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      const file = acceptedFiles[0];

      if (!file) return;

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError("File size too large. Max 10MB allowed.");
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setError(null);
  };

  return (
    <div className={cn("w-full max-w-xl mx-auto", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out",
          isDragActive
            ? "border-primary bg-primary/5 ring-4 ring-primary/10"
            : "border-white/10 hover:border-white/20 hover:bg-white/5",
          preview ? "h-[400px] border-none" : "h-[300px]",
          "flex flex-col items-center justify-center p-6 text-center"
        )}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {!preview ? (
            <motion.div
              key="upload-placeholder"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative rounded-full bg-surface-elevated p-4 ring-1 ring-white/10 group-hover:ring-primary/50 transition-all duration-300">
                  <Upload className="h-8 w-8 text-white/70 group-hover:text-primary transition-colors duration-300" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-lg font-medium text-white">
                  Drop your image here, or click to browse
                </p>
                <p className="text-sm text-white/50">
                  Supports HD & 4K · PNG, JPG, WEBP up to 10MB
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative h-full w-full"
            >
              <img
                src={preview}
                alt="Preview"
                className="h-full w-full object-contain rounded-xl"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-xl">
                 <p className="text-white font-medium">Click or Drop to Replace</p>
              </div>
              <button
                 onClick={removeFile}
                 className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-destructive/80 text-white rounded-full backdrop-blur-md transition-colors"
               >
                 <X className="w-5 h-5" />
               </button>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.p
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="absolute bottom-4 text-destructive text-sm font-medium bg-destructive/10 px-3 py-1 rounded-full"
          >
            {error}
          </motion.p>
        )}
      </div>
    </div>
  );
}
