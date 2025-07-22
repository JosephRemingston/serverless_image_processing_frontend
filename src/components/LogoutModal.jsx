import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LogOut } from "lucide-react";

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modal = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="bg-white dark:bg-[#1F2937] rounded-2xl shadow-2xl p-8 w-[90%] max-w-md text-center"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
            >
              <X size={24} />
            </button>

            <LogOut size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2 dark:text-white">Confirm Logout</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to logout? You will need to log in again to access your account.
            </p>

            <div className="flex justify-center space-x-4">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg transition"
              >
                Logout
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LogoutModal;