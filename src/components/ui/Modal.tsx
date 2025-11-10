"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  confirmText?: string;
  onConfirm?: () => void;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  confirmText = "OK",
  onConfirm,
  className,
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={cn(
              "bg-white/10 border border-white/20 backdrop-blur-2xl rounded-2xl p-6 shadow-2xl w-[90%] max-w-md text-white",
              className
            )}
          >
            {title && (
              <h2 className="text-2xl font-semibold mb-4 text-center text-white">
                {title}
              </h2>
            )}

            <div className="text-gray-200 text-sm mb-6">{children}</div>

            <div className="flex justify-end gap-3">
              <Button
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2"
              >
                Cancel
              </Button>

              {onConfirm && (
                <Button
                  onClick={onConfirm}
                  className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2"
                >
                  {confirmText}
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

