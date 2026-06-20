"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type MegaMenuColumn = {
  title: string;
  links: { label: string; href: string }[];
};

type MegaMenuProps = {
  open: boolean;
  columns: MegaMenuColumn[];
  onClose: () => void;
  featured?: {
    title: string;
    href: string;
    imageUrl: string;
  };
};

export function MegaMenu({ open, columns, onClose, featured }: MegaMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -2 }}
          transition={{ duration: 0.2 }}
          className="absolute left-0 right-0 top-full z-50 border-b border-border bg-canvas shadow-premium-sm"
          onMouseLeave={onClose}
        >
          <div className="page-container grid gap-10 py-10 md:grid-cols-5">
            {columns.map((column) => (
              <div key={column.title}>
                <p className="label-caps mb-4 text-ink">{column.title}</p>
                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className="font-body text-sm text-ink-muted transition-colors hover:text-crimson"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {featured && (
              <Link
                href={featured.href}
                onClick={onClose}
                className="group relative hidden aspect-[3/4] overflow-hidden bg-surface-muted md:block"
              >
                <Image
                  src={featured.imageUrl}
                  alt={featured.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="280px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                <p className="absolute bottom-4 left-4 font-display text-lg text-canvas">
                  {featured.title}
                </p>
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
