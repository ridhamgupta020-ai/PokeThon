"use client";
import { motion, useScroll, useTransform } from "framer-motion";

/** Lightweight decorative layer: gradients, particles, shapes, product & blog cards.
 *  Pure transforms (GPU-friendly), aria-hidden, pointer-events none. */

const float = (dy: number, dur: number, delay = 0) => ({
  animate: { y: [0, dy, 0], rotate: [0, 2, 0] },
  transition: { duration: dur, repeat: Infinity, ease: "easeInOut" as const, delay },
});

function ProductCard({ className, delay, dur }: { className: string; delay: number; dur: number }) {
  return (
    <motion.div {...float(-18, dur, delay)} className={`absolute hidden w-44 rounded-2xl border border-neutral-200 bg-white/80 p-3 shadow-card backdrop-blur md:block ${className}`}>
      <div className="mb-2 grid h-24 place-items-center rounded-xl bg-gradient-to-br from-brand-200 to-brand-400">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="1.6"><path d="M3 7l9-4 9 4-9 4-9-4Zm0 0v10l9 4 9-4V7M12 11v10" /></svg>
      </div>
      <div className="h-2.5 w-24 rounded bg-neutral-800/80" />
      <div className="mt-1.5 flex items-center justify-between">
        <div className="h-2 w-12 rounded bg-neutral-300" />
        <div className="h-5 w-12 rounded-full bg-brand-400" />
      </div>
    </motion.div>
  );
}

function BlogCard({ className, delay, dur }: { className: string; delay: number; dur: number }) {
  return (
    <motion.div {...float(16, dur, delay)} className={`absolute hidden w-52 rounded-2xl border border-neutral-200 bg-white/80 p-3.5 shadow-card backdrop-blur lg:block ${className}`}>
      <div className="mb-2 flex items-center gap-2">
        <div className="h-5 w-5 rounded-full bg-ink" />
        <div className="h-2 w-16 rounded bg-neutral-300" />
      </div>
      <div className="h-3 w-40 rounded bg-neutral-800/80" />
      <div className="mt-1.5 h-3 w-28 rounded bg-neutral-800/80" />
      <div className="mt-3 space-y-1.5">
        <div className="h-2 w-full rounded bg-neutral-200" />
        <div className="h-2 w-11/12 rounded bg-neutral-200" />
        <div className="h-2 w-8/12 rounded bg-neutral-200" />
      </div>
    </motion.div>
  );
}

const particles = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 37 + 8) % 96}%`,
  top: `${(i * 53 + 12) % 90}%`,
  size: 4 + (i % 4) * 2,
  dur: 6 + (i % 5) * 2,
  delay: (i % 6) * 0.6,
}));

export function AnimatedBackground() {
  const { scrollY } = useScroll();
  const slow = useTransform(scrollY, [0, 900], [0, -90]);
  const slower = useTransform(scrollY, [0, 900], [0, -40]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-gradient-to-b from-white via-white to-mist">
      <motion.div style={{ y: slower }} className="absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-brand-300/40 blur-3xl" />
      <motion.div style={{ y: slow }} className="absolute -right-24 top-24 h-[24rem] w-[24rem] rounded-full bg-brand-200/60 blur-3xl" />
      <div className="absolute inset-0 opacity-[0.35] [background-image:radial-gradient(#0a0a0a14_1px,transparent_1px)] [background-size:28px_28px]" />

      <motion.div style={{ y: slow }} className="absolute inset-0">
        <ProductCard className="left-[4%] top-40" delay={0} dur={9} />
        <ProductCard className="right-[6%] top-[30rem]" delay={1.5} dur={11} />
        <BlogCard className="right-[4%] top-44" delay={0.8} dur={10} />
        <BlogCard className="left-[5%] top-[31rem]" delay={2} dur={12} />
      </motion.div>

      <motion.div {...float(-14, 8)} className="absolute left-[18%] top-28 h-10 w-10 rotate-12 rounded-lg border-2 border-ink/80" />
      <motion.div {...float(12, 10, 1)} className="absolute right-[22%] top-60 h-9 w-9 rounded-full bg-brand-400" />
      <motion.div {...float(-10, 9, 2)} className="absolute left-[40%] top-[28rem] h-0 w-0 border-x-[18px] border-b-[30px] border-x-transparent border-b-brand-400/80" />
      <motion.svg {...float(10, 12)} className="absolute right-[30%] top-24" width="60" height="60" viewBox="0 0 60 60" fill="none" stroke="#0a0a0a" strokeWidth="2"><path d="M8 30h12l6-14 8 28 6-14h12" /></motion.svg>

      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-brand-500/60"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
