"use client";

import { useState } from "react";
import Dropzone from "@/components/ui/Dropzone";
import ComparisonSlider from "@/components/ui/ComparisonSlider";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { Download, Sparkles, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    // Create local preview
    const objectUrl = URL.createObjectURL(file);
    setOriginalImage(objectUrl);
    setProcessedImage(null); // Reset previous result
    setErrorMessage(null); // Clear previous errors
    setIsProcessing(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/remove-bg", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Processing failed");
      }

      const blob = await response.blob();
      const processedUrl = URL.createObjectURL(blob);
      
      clearInterval(interval);
      setProgress(100);
      
      // Artificial delay to show 100%
      setTimeout(() => {
        setProcessedImage(processedUrl);
        setIsProcessing(false);
      }, 500);

    } catch (error) {
      console.warn("Processing error (handled):", error);
      setIsProcessing(false);
      clearInterval(interval);
      
      let message = "Failed to process image. Please try again.";
      if (error instanceof Error) {
        message = error.message;
        // Improve phrasing for common API error
        if (message.includes("Could not identify foreground")) {
            message = "AI couldn't detect a clear subject. Please try an image with a distinct foreground.";
        }
      }
      setErrorMessage(message);
      setOriginalImage(null); // Reset so they can try again easily
    }
  };

  const downloadImage = () => {
    if (!processedImage) return;
    const link = document.createElement("a");
    link.href = processedImage;
    link.download = "removed-bg-hd.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setProgress(0);
    setErrorMessage(null);
  };

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden selection:bg-primary/30">
        
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 flex flex-col items-center gap-12">
        
        {/* Header */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-primary-foreground/80 mb-4">
             <Sparkles className="w-4 h-4 text-primary" />
             <span>AI-Powered HD Precision</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
            Remove Backgrounds <br/> without Quality Loss
          </h1>
          <p className="text-lg text-muted-foreground">
            Instantly process 4K/HD images. Keep every pixel of detail.
          </p>
        </motion.div>

        {/* Error Message Display */}
        {errorMessage && (
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-destructive/10 border border-destructive/20 text-destructive px-6 py-3 rounded-lg flex items-center gap-2"
            >
                <span className="font-semibold">Error:</span> {errorMessage}
            </motion.div>
        )}

        {/* Main Interface */}
        <div className="w-full max-w-5xl">
            {isProcessing && <LoadingOverlay progress={progress} />}
            
            {!originalImage ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Dropzone onFileSelect={handleFileSelect} />
                </motion.div>
            ) : (
                <div className="space-y-8">
                     {/* Result Area */}
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            layout
                            className="relative w-full bg-black/50 rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
                        >
                            {!processedImage ? (
                                // Determine what to show while waiting? The loading overlay covers this.
                                // But we can show the original image blurred or something.
                                <img src={originalImage} className="w-full h-auto object-contain opacity-50 blur-sm" />
                            ) : (
                                <ComparisonSlider 
                                    beforeImage={originalImage} 
                                    afterImage={processedImage} 
                                />
                            )}
                        </motion.div>
                    </div>

                    {/* Actions */}
                     <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap items-center justify-center gap-4"
                     >
                        <button 
                            onClick={reset}
                            className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all font-medium flex items-center gap-2"
                        >
                            <ImageIcon className="w-5 h-5" />
                            Upload Another
                        </button>
                        
                        {processedImage && (
                            <button 
                                onClick={downloadImage}
                                className="px-8 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 transition-all font-bold flex items-center gap-2 transform hover:scale-105 active:scale-95"
                            >
                                <Download className="w-5 h-5" />
                                Download HD PNG
                            </button>
                        )}
                     </motion.div>
                </div>
            )}
        </div>
      </div>
    </main>
  );
}
