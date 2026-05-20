import * as React from "react";
import { Button } from "./Button";
import { X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  variant = "danger",
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-[24px] shadow-2xl w-full max-w-md relative z-10 overflow-hidden border border-slate-100"
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                  variant === 'danger' ? "bg-red-50 text-red-600" : "bg-primary/10 text-primary"
                )}>
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-slate-900 leading-6">{title}</h3>
                  {description && (
                    <p className="mt-2 text-sm text-slate-500 font-medium leading-relaxed">
                      {description}
                    </p>
                  )}
                </div>
                <button 
                  onClick={onClose} 
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
              <Button 
                variant="ghost" 
                onClick={onClose}
                className="rounded-xl font-bold text-slate-500 hover:bg-slate-200/50"
              >
                {cancelText}
              </Button>
              <Button 
                variant={variant}
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="rounded-xl font-bold shadow-sm"
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
