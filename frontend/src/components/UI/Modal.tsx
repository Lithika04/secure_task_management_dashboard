// Reusable animated modal component using Framer Motion.
// Displays dynamic content with backdrop click-to-close support.
import React from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ModalProps {
  isOpen: boolean;           // controls whether modal is visible
  title?: string;            // optional header text
  onClose: () => void;       // called when backdrop or Close clicked
  children: React.ReactNode; // any content inside the modal
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, onClose, children }) => {
  return (
    // AnimatePresence MUST wrap conditional rendering for exit animations.
    // Without it, exit animation is skipped — element just disappears.
    <AnimatePresence>
      {isOpen && (
        // BACKDROP — full screen dark overlay
        // Clicking it calls onClose to close the modal
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}  // starts invisible
          animate={{ opacity: 1 }}  // fades in
          exit={{ opacity: 0 }}     // fades out before removed
          onClick={onClose}         // click backdrop = close
        >
          {/* PANEL WRAPPER — controls max width */}
          <motion.div
            className="w-full max-w-2xl"
            initial={{ opacity: 0, y: 14, scale: 0.98 }} // below + smaller
            animate={{ opacity: 1, y: 0, scale: 1 }}     // slides up
            exit={{ opacity: 0, y: 8, scale: 0.98 }}     // slides down on exit
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            // stopPropagation: clicks INSIDE panel don't
            // bubble up to backdrop — prevents accidental close
          >
            {/* WHITE CARD */}
            <div className="rounded-2xl border border-sky-100 bg-white shadow-xl">

              {/* HEADER — title + close button */}
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  {title || "Modal"}
                </h3>
                <button
                  onClick={onClose}
                  className="rounded-md px-2 py-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                >
                  Close
                </button>
              </div>

              {/* BODY — renders whatever children are passed */}
              {/* Could be TaskForm, delete confirm, or anything */}
              <div className="p-5">{children}</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;