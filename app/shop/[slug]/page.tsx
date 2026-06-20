import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata, productSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getRelatedProducts,
  getCompleteTheLook,
  getProductGalleryImages,
  toBagProduct,
} from "@/lib/product-seo";
import {
  getCatalogProductBySlug,
  getCatalogProducts,
  getCatalogSlugs,
} from "@/lib/catalog-db";
import { getDepartmentLabel } from "@/lib/catalog";
import { formatPrice } from "@/lib/constants";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ProductPageClient } from "@/components/shop/ProductPageClient";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { CompleteTheLook } from "@/components/shop/CompleteTheLook";
import { ProductViewTracker } from "@/components/shop/ProductViewTracker";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const slugs = await getCatalogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getCatalogProductBySlug(params.slug);
  if (!product) return {};
  return pageMetadata({
    title: `${product.name} | Buy Online at Vimala Silk House`,
    description: product.description,
    path: `/shop/${product.slug}`,
  });
}

export default async function ProductPage({ params }: Props) {
  const [product, catalog] = await Promise.all([
    getCatalogProductBySlug(params.slug),
    getCatalogProducts(),
  ]);
  if (!product) notFound();

  const related = getRelatedProducts(product, catalog);
  const completeTheLook = getCompleteTheLook(product, catalog);
  const galleryImages = getProductGalleryImages(product);
  const bagProduct = toBagProduct(product);
  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in ${product.name} (${formatPrice(product.price)}, SKU: ${product.sku}).`
  );

  return (
    <div className="bg-canvas pt-header pb-24 md:pb-12">
      <ProductViewTracker
        productId={product.id}
        slug={product.slug}
        name={product.name}
        price={product.price}
        imageUrl={product.imageUrl}
      />
      <JsonLd data={productSchema(product)} />
      <div className="page-container py-8 sm:py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
          <ProductGallery
            images={galleryImages}
            alt={product.imageAlt}
            badge={product.scarcityNote}
          />
          <ProductPageClient
            bagProduct={bagProduct}
            category={product.category}
            departmentLabel={getDepartmentLabel(product.department)}
            originalPrice={product.originalPrice}
            scarcityNote={product.scarcityNote}
            fabric={product.fabric}
            whatsappMessage={whatsappMessage}
          />
        </div>

        <CompleteTheLook products={completeTheLook} />

        {related.length > 0 && (
          <div className="mt-16 border-t border-gold/15 pt-12 sm:mt-20 sm:pt-16">
            <SectionTitle title="You May Also Like" align="left" showLotus={false} />
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  href={`/shop/${p.slug}`}
                  name={p.name}
                  price={p.price}
                  fabric={p.fabric}
                  category={p.category}
                  department={p.department}
                  slug={p.slug}
                  productId={p.id}
                  imageUrl={p.imageUrl}
                  hoverImageUrl={p.hoverImageUrl}
                  isNew={p.isNew}
                  originalPrice={p.originalPrice}
                  discount={p.discount}
                  scarcityNote={p.scarcityNote}
                  sizes={p.sizes}
                  bagProduct={toBagProduct(p)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
