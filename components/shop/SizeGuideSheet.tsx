"use client";

import { Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const SIZE_ROWS = [
  { size: "Free", bust: "32–38\"", waist: "28–34\"", length: "5.5 m" },
  { size: "S", bust: "32–34\"", waist: "28–30\"", length: "5.5 m" },
  { size: "M", bust: "34–36\"", waist: "30–32\"", length: "5.5 m" },
  { size: "L", bust: "36–38\"", waist: "32–34\"", length: "5.5 m" },
  { size: "XL", bust: "38–40\"", waist: "34–36\"", length: "5.5 m" },
] as const;

export function SizeGuideSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-auto px-0 py-0 font-body text-xs text-crimson hover:bg-transparent hover:underline"
        >
          <Ruler className="mr-1.5 h-3.5 w-3.5" />
          Size guide
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="glass-panel max-h-[85vh] rounded-t-3xl border-gold/25 bg-ivory/98 text-ink">
        <SheetHeader>
          <SheetTitle className="font-display text-crimson">Size Guide</SheetTitle>
        </SheetHeader>
        <p className="mt-2 font-body text-sm text-ink/55">
          Approximate measurements for readymade and pre-stitched pieces. Silk sarees
          are typically free size with standard 5.5 m length.
        </p>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-gold/15">
          <table className="w-full min-w-[320px] text-left font-body text-sm">
            <thead>
              <tr className="border-b border-gold/15 bg-ivory-warm/80">
                <th className="px-4 py-3 font-medium text-crimson">Size</th>
                <th className="px-4 py-3 font-medium text-crimson">Bust</th>
                <th className="px-4 py-3 font-medium text-crimson">Waist</th>
                <th className="px-4 py-3 font-medium text-crimson">Length</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_ROWS.map((row) => (
                <tr key={row.size} className="border-b border-gold/10 last:border-0">
                  <td className="px-4 py-2.5 font-medium">{row.size}</td>
                  <td className="px-4 py-2.5 text-ink/65">{row.bust}</td>
                  <td className="px-4 py-2.5 text-ink/65">{row.waist}</td>
                  <td className="px-4 py-2.5 text-ink/65">{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 font-body text-xs text-ink/45">
          Need help choosing? Message us on WhatsApp with your measurements — our
          team will recommend the best fit.
        </p>
      </SheetContent>
    </Sheet>
  );
}
