import { Gem, Heart, Truck, MessageCircle } from "lucide-react";
import { TRUST_FEATURES } from "@/lib/constants";

const icons = [Gem, Heart, Truck, MessageCircle];

export function TrustBar() {
  return (
    <section className="border-y border-gold/20 bg-gold-pale/40">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-6 px-4 py-10 md:grid-cols-4 md:gap-8 md:px-16 md:py-12">
        {TRUST_FEATURES.map((feature, i) => {
          const Icon = icons[i];
          return (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center md:items-start md:text-left"
            >
              <Icon className="mb-3 h-5 w-5 text-gold" strokeWidth={1.25} />
              <h3 className="font-display text-sm font-medium uppercase tracking-wider text-crimson">
                {feature.title}
              </h3>
              <p className="mt-1 font-body text-xs leading-relaxed text-ink/55">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
