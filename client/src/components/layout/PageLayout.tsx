import * as React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PageLayoutProps {
  children: React.ReactNode;
  variant?: "default" | "admin" | "auth";
  className?: string;
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export function PageLayout({ children, variant = "default", className }: PageLayoutProps) {
  if (variant === "admin") {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <motion.main
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn("ml-[280px] min-h-screen p-6 lg:p-8", className)}
        >
          {children}
        </motion.main>
      </div>
    );
  }

  if (variant === "auth") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <motion.main
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn("w-full max-w-md", className)}
        >
          {children}
        </motion.main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <motion.main
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn("flex-1 pt-16 lg:pt-20", className)}
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
}
