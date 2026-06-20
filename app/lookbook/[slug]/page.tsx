import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { getAllLookbookSlugs, getLookbook } from "@/lib/lookbook";
import { LookbookView } from "@/components/lookbook/LookbookView";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return getAllLookbookSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const book = getLookbook(params.slug);
  if (!book) return {};
  return pageMetadata({
    title: `${book.title} Lookbook | Vimala Silk House`,
    description: book.subtitle,
    path: `/lookbook/${book.slug}`,
  });
}

export default function LookbookPage({ params }: Props) {
  const book = getLookbook(params.slug);
  if (!book) notFound();

  return (
    <div className="bg-ivory pt-header">
      <LookbookView lookbook={book} />
    </div>
  );
}
