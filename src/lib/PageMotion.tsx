'use client';

import { usePathname } from "next/navigation";

import {motion } from "framer-motion";

export const PageMotion = ({ children }) => {
  const pathname = usePathname();
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1],}}
    >
      {children}
    </motion.div>
  );
}