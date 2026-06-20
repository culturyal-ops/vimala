/**
 * Customer video reel — add entries here (supports 100+).
 * Each frame is 9:16. Set videoUrl when the clip is ready; posterUrl shows until then.
 */
export type CustomerVideoFrame = {
  id: string;
  posterUrl: string;
  /** MP4 or WebM URL. Leave null to show poster only (slot reserved). */
  videoUrl: string | null;
  label?: string;
};

const POSTER = {
  silk: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=540&h=960&fit=crop",
  bridal: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=540&h=960&fit=crop",
  festive: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=540&h=960&fit=crop",
  store: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=540&h=960&fit=crop",
  family: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=540&h=960&fit=crop",
  accessories:
    "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=540&h=960&fit=crop",
} as const;

/** Starter slots — duplicate pattern or paste up to 100+ entries. */
export const CUSTOMER_VIDEO_FRAMES: CustomerVideoFrame[] = [
  { id: "v01", posterUrl: POSTER.silk, videoUrl: null, label: "Bridal silk" },
  { id: "v02", posterUrl: POSTER.bridal, videoUrl: null, label: "Wedding guest" },
  { id: "v03", posterUrl: POSTER.festive, videoUrl: null, label: "Onam ready" },
  { id: "v04", posterUrl: POSTER.silk, videoUrl: null, label: "Kanjivaram drape" },
  { id: "v05", posterUrl: POSTER.family, videoUrl: null, label: "Family shopping" },
  { id: "v06", posterUrl: POSTER.accessories, videoUrl: null, label: "Complete the look" },
  { id: "v07", posterUrl: POSTER.bridal, videoUrl: null, label: "Trousseau day" },
  { id: "v08", posterUrl: POSTER.festive, videoUrl: null, label: "Festive evening" },
  { id: "v09", posterUrl: POSTER.store, videoUrl: null, label: "At our store" },
  { id: "v10", posterUrl: POSTER.silk, videoUrl: null, label: "Pure silk" },
  { id: "v11", posterUrl: POSTER.family, videoUrl: null, label: "Kids' festive" },
  { id: "v12", posterUrl: POSTER.bridal, videoUrl: null, label: "Bridal walk" },
];

export function getCustomerVideoFrames(): CustomerVideoFrame[] {
  return CUSTOMER_VIDEO_FRAMES;
}
