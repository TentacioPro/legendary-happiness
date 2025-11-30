"use client";
import { motion } from "framer-motion";

export default function MotionText({
  children,
  delayOffset = 0,
}: {
  children: string;
  delayOffset: number;
}) {
  const text = children;
  const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
  const letters = Array.from(segmenter.segment(text), (s) => s.segment).map(
    (letter) => (letter === " " ? "\u00A0" : letter),
  );

  return (
    <motion.div>
      {letters.map((letter, index) => (
        <motion.span
          className="inline-flex"
          key={index}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: index * 0.015 + delayOffset, // Reduced from 0.03 to 0.015 (2x faster)
            type: "spring",
            damping: 20, // Increased damping for faster settling
            stiffness: 500, // Increased stiffness for snappier animation
          }}
        >
          {letter}
        </motion.span>
      ))}
    </motion.div>
  );
}
