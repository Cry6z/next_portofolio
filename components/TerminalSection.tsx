"use client";

import React from "react";
import { motion } from "framer-motion";
import InteractiveTerminal from "@/components/InteractiveTerminal";

export default function TerminalSection() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <section id="terminal" className="py-24 border-t border-border-custom">
      <div className="flex flex-col gap-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="flex flex-col gap-2"
        >
          <span className="text-xs font-bold tracking-widest font-mono text-accent-custom uppercase">
            SIMULASI SHELL / 02
          </span>
          <h3 className="text-4xl md:text-5xl font-black tracking-tighter">TERMINAL.</h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <InteractiveTerminal />
        </motion.div>
      </div>
    </section>
  );
}
