"use client";
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ProfileImageProps {
  src?: string;
  alt?: string;
  size?: number;
}

export function ProfileImage({ src = '/profile.jpg', alt = 'Profile portrait', size = 200 }: ProfileImageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative group"
      style={{ width: size, height: size }}
    >
      <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-br from-neon-pink/60 via-neon-blue/40 to-neon-green/50 blur-xl opacity-30 group-hover:opacity-60 transition-opacity" />
      <div className="relative w-full h-full rounded-[24px] overflow-hidden glass border border-white/10 shadow-lg">
        <Image
          src={src}
            alt={alt}
            fill
            sizes={`${size}px`}
            priority
            className="object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-700 ease-out mix-blend-luminosity dark:mix-blend-normal"
        />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-black/10 to-transparent dark:from-black/60" />
      </div>
    </motion.div>
  );
}
