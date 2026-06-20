import Link from "next/link";
import Image from "next/image";
import type { Lookbook } from "@/lib/lookbook";
import { getProductBySlug, toBagProduct } from "@/lib/product-seo";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/button";

type LookbookViewProps = {
  lookbook: Lookbook;
};

export function LookbookView({ lookbook }: LookbookViewProps) {
  return (
    <article>
      <div className="relative aspect-[4/5] w-full sm:aspect-[21/9]">
        <Image
          src={lookbook.heroImageUrl}
          alt={lookbook.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-crimson-dark via-crimson-dark/50 to-crimson-dark/20" />
        <div className="absolute inset-0 flex flex-col justify-end page-container pb-10 sm:pb-16">
          <p className="mb-2 font-body text-[10px] uppercase tracking-[0.4em] text-gold">
            Lookbook
          </p>
          <h1 className="font-display text-4xl font-medium text-ivory sm:text-6xl">
            {lookbook.title}
          </h1>
          <p className="mt-3 max-w-lg font-body text-sm text-ivory/65 sm:text-base">
            {lookbook.subtitle}
          </p>
        </div>
      </div>

      <div className="page-container section-pad">
        {lookbook.scenes.map((scene, index) => {
          const products = scene.productSlugs
            .map((slug) => getProductBySlug(slug))
            .filter((p): p is NonNullable<typeof p> => Boolean(p));

          return (
            <section
              key={scene.caption}
              className={index > 0 ? "mt-16 border-t border-gold/15 pt-16 sm:mt-24 sm:pt-24" : ""}
            >
              <div
                className={
                  index % 2 === 0
                    ? "grid gap-8 lg:grid-cols-12 lg:gap-12"
                    : "grid gap-8 lg:grid-cols-12 lg:gap-12"
                }
              >
                <div
                  className={
                    index % 2 === 0
                      ? "lg:col-span-7"
                      : "lg:col-span-7 lg:col-start-6 lg:row-start-1"
                  }
                >
                  <div className="luxury-card relative aspect-[4/5] overflow-hidden rounded-3xl sm:aspect-[3/4]">
                    <Image
                      src={scene.imageUrl}
                      alt={scene.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 58vw"
                    />
                  </div>
                </div>

                <div
                  className={
                    index % 2 === 0
                      ? "flex flex-col justify-center lg:col-span-5"
                      : "flex flex-col justify-center lg:col-span-5 lg:col-start-1 lg:row-start-1"
                  }
                >
                  <p className="font-body text-[10px] uppercase tracking-[0.35em] text-gold-muted">
                    Scene {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-medium text-crimson sm:text-3xl">
                    {scene.caption}
                  </h2>
                  <p className="mt-4 font-body text-sm leading-relaxed text-ink/55">
                    {scene.imageAlt}
                  </p>

                  {products.length > 0 && (
                    <div className="mt-8">
                      <p className="mb-4 font-body text-[10px] uppercase tracking-widest text-ink/40">
                        Shop this look
                      </p>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        {products.slice(0, 2).map((p) => (
                          <ProductCard
                            key={p.id}
                            href={`/shop/${p.slug}`}
                            name={p.name}
                            price={p.price}
                            fabric={p.fabric}
                            category={p.category}
                            department={p.department}
                            imageUrl={p.imageUrl}
                            hoverImageUrl={p.hoverImageUrl}
                            isNew={p.isNew}
                            originalPrice={p.originalPrice}
                            bagProduct={toBagProduct(p)}
                            showRating={false}
                          />
                        ))}
                      </div>
                      {products.length > 2 && (
                        <Button variant="ghost" asChild className="mt-4">
                          <Link href={`/shop/${products[0].slug}`}>
                            View all pieces →
                          </Link>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        })}

        <div className="mt-20 text-center">
          <SectionTitle title="Explore More" />
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/shop/category/bridal">Shop Bridal</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/shop">All Products</Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
