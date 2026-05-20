import * as React from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { X, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PromptModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  placeholder?: string;
  defaultValue?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: (value: string) => void;
  onClose: () => void;
}

export function PromptModal({
  isOpen,
  title,
  description,
  placeholder,
  defaultValue = "",
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  onConfirm,
  onClose,
}: PromptModalProps) {
  const [value, setValue] = React.useState(defaultValue);

  React.useEffect(() => {
    if (isOpen) {
      setValue(defaultValue);
    }
  }, [isOpen, defaultValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(value);
    onClose();
  };

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
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-[24px] shadow-2xl w-full max-w-md relative z-10 overflow-hidden border border-slate-100"
          >
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <HelpCircle className="w-6 h-6" />
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
                  type="button"
                  onClick={onClose} 
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <Input
                autoFocus
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="h-11 rounded-xl border-slate-200 focus:border-primary font-medium"
              />
            </div>
            
            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
              <Button 
                type="button"
                variant="ghost" 
                onClick={onClose}
                className="rounded-xl font-bold text-slate-500 hover:bg-slate-200/50"
              >
                {cancelText}
              </Button>
              <Button 
                type="submit"
                variant="primary"
                className="rounded-xl font-bold shadow-sm"
              >
                {confirmText}
              </Button>
            </div>
          </motion.form>
        </div>
      )}
    </AnimatePresence>
  );
}
