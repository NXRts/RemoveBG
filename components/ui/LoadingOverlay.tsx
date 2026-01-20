"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  progress?: number;
  message?: string;
}

export default function LoadingOverlay({
  progress = 0,
  message = "Processing HD Image...",
}: LoadingOverlayProps) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 p-8"
      >
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-linear-to-r from-primary to-blue-500 blur-lg opacity-75 animate-pulse" />
          <div className="relative bg-surface rounded-full p-4 ring-1 ring-white/10">
             <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <h3 className="text-xl font-semibold text-white tracking-tight">
            {message}
          </h3>
          <p className="text-white/60 text-sm">This may take a few seconds</p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-linear-to-r from-primary to-blue-500"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>
    </div>
  );
}
