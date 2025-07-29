"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className="mb-8"
      >
        <Image
          src="https://general-public-image-buckets.s3.amazonaws.com/steiny/images/branding/logo-primary.jpeg"
          alt="Steiny B's Logo"
          width={120}
          height={120}
        />
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-brand-green font-bold text-xl mb-4"
      >
        Firing up the grill...
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex gap-3"
      >
        <motion.div
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
          className="w-4 h-4 bg-brand-green rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          className="w-4 h-4 bg-brand-green rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
          className="w-4 h-4 bg-brand-green rounded-full"
        />
      </motion.div>
    </div>
  );
}