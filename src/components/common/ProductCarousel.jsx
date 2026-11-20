import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   5-slot 3D perspective positions  (matches TeamCarousel design)

   offset = (cardIndex - currentIndex + total) % total

   offset 0           → center   (active, full color, scaled up)
   offset 1           → right-1  (immediate right, slightly back)
   offset 2           → right-2  (far right, more depth)
   offset total-1     → left-1   (immediate left)
   offset total-2     → left-2   (far left)
   anything else      → hidden
───────────────────────────────────────────────────────────────*/
function getSlotStyle(offset, total) {
  if (offset === 0) {
    return {
      zIndex: 10,
      transform: 'scale(1.08) translateZ(0)',
      opacity: 1,
      pointerEvents: 'auto',
      filter: 'brightness(1) grayscale(0)',
    };
  }
  if (offset === 1) {
    return {
      zIndex: 5,
      transform: 'translateX(220px) scale(0.88) translateZ(-100px)',
      opacity: 0.88,
      pointerEvents: 'auto',
      filter: 'brightness(0.65) grayscale(60%)',
    };
  }
  if (offset === 2) {
    return {
      zIndex: 1,
      transform: 'translateX(400px) scale(0.75) translateZ(-300px)',
      opacity: 0.6,
      pointerEvents: 'auto',
      filter: 'brightness(0.5) grayscale(100%)',
    };
  }
  if (offset === total - 1) {
    return {
      zIndex: 5,
      transform: 'translateX(-220px) scale(0.88) translateZ(-100px)',
      opacity: 0.88,
      pointerEvents: 'auto',
      filter: 'brightness(0.65) grayscale(60%)',
    };
  }
  if (offset === total - 2) {
    return {
      zIndex: 1,
      transform: 'translateX(-400px) scale(0.75) translateZ(-300px)',
      opacity: 0.6,
      pointerEvents: 'auto',
      filter: 'brightness(0.5) grayscale(100%)',
    };
  }
  // hidden — park behind center
  return {
    zIndex: 0,
    transform: 'scale(0.5) translateZ(-400px)',
    opacity: 0,
    pointerEvents: 'none',
    filter: 'brightness(0.3) grayscale(100%)',
  };
}

/* ─── product image with fallback icon ──────────────────── */
function ProductVisual({ src, alt, Icon, className }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-[#0645C5] via-[#032B91] to-[#061B50] ${className}`}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#FFD700]/40 bg-[#041540]/80 text-[#FFD700]">
          <Icon className="h-7 w-7" />
        </div>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`object-cover object-center ${className}`}
    />
  );
}

/* ─── main component ─────────────────────────────────────── */
export function ProductCarousel({ products, onCardClick }) {
  const total = products.length;
  const [activeIdx, setActiveIdx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [nameVisible, setNameVisible] = useState(true);
  const touchStartX = useRef(0);

  const goTo = useCallback(
    (newIdx) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setNameVisible(false);

      const resolved = ((newIdx % total) + total) % total;

      setTimeout(() => {
        setActiveIdx(resolved);
        setNameVisible(true);
      }, 300);

      setTimeout(() => setIsAnimating(false), 800);
    },
    [isAnimating, total]
  );

  /* keyboard navigation */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') goTo(activeIdx - 1);
      if (e.key === 'ArrowRight') goTo(activeIdx + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIdx, goTo]);

  /* touch swipe */
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };
  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? activeIdx + 1 : activeIdx - 1);
  };

  const active = products[activeIdx];

  return (
    <div
      className="flex flex-col items-center select-none w-full"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── arrow + stage row ─────────────────────────────── */}
      <div className="flex items-center w-full gap-3" style={{ maxWidth: 1200 }}>

        {/* LEFT ARROW — fully outside the stage */}
        <button
          type="button"
          onClick={() => goTo(activeIdx - 1)}
          aria-label="Previous product"
          className="shrink-0 flex h-11 w-11 items-center justify-center rounded-full border-none text-white text-2xl cursor-pointer transition-all duration-300 hover:scale-110"
          style={{ background: 'rgba(8,42,123,0.7)', paddingBottom: 4, paddingRight: 3 }}
        >
          ‹
        </button>

        {/* ── 3D stage ────────────────────────────────────── */}
        <div
          className="relative flex-1"
          style={{ height: 480, perspective: '1000px' }}
          aria-label="Product carousel"
        >


        {/* cards */}
        <div
          className="relative w-full h-full"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {products.map((product, i) => {
            const Icon = product.icon;
            const offset = ((i - activeIdx) % total + total) % total;
            const slotStyle = getSlotStyle(offset, total);
            const isCenter = offset === 0;

            return (
              <div
                key={product.id}
                onClick={() => {
                  if (isCenter) {
                    onCardClick && onCardClick(product.id);
                  } else {
                    goTo(i);
                  }
                }}
                className="absolute flex flex-col overflow-hidden rounded-[20px] cursor-pointer"
                style={{
                  width: 320,
                  height: 420,
                  left: '50%',
                  top: '50%',
                  marginLeft: -160,
                  marginTop: -210,
                  transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  background: 'linear-gradient(180deg, #0A4FD4 0%, #042A89 55%, #041442 100%)',
                  boxShadow: isCenter
                    ? '0 24px 50px rgba(3,43,145,0.55), 0 0 0 1px rgba(39,217,255,0.3)'
                    : '0 14px 30px rgba(3,43,145,0.3)',
                  ...slotStyle,
                }}
                role="button"
                tabIndex={isCenter ? 0 : -1}
                aria-label={product.connectedTitle}
              >
                {/* gold top rim */}
                <div
                  className="absolute inset-x-0 top-0 z-20 h-[2px]"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, #FFE98A, transparent)',
                    opacity: isCenter ? 1 : 0.5,
                  }}
                />

                {/* product image */}
                <div className="relative h-[200px] shrink-0 overflow-hidden bg-[#031F6B]">
                  <ProductVisual
                    src={product.image}
                    alt={product.connectedTitle}
                    Icon={Icon}
                    className="h-full w-full"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#042A89] via-[#042A89]/15 to-transparent" />

                  {/* brand + title overlay */}
                  <div className="absolute left-0 top-0 z-20 px-3 pt-3">
                    <p className="font-display text-[9px] font-extrabold tracking-widest text-[#FFD700] uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
                      {product.brandPrefix}
                    </p>
                    <h3 className="font-display text-[18px] font-extrabold leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                      {product.title}
                    </h3>
                  </div>
                </div>

                {/* card body */}
                <div className="flex flex-1 flex-col justify-between px-4 pb-4 pt-3 text-white">
                  <p className="line-clamp-2 text-[11px] leading-relaxed text-blue-100/90">
                    {product.summary}
                  </p>

                  <ul className="mt-2 space-y-1.5">
                    {product.features.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-center gap-1.5 text-[10px] font-semibold text-blue-50"
                      >
                        <CheckCircle2 className="h-3 w-3 shrink-0 text-[#FFD700]" />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  {/* CTA — only shown on center card */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isCenter) return;
                      onCardClick && onCardClick(product.id);
                    }}
                    tabIndex={isCenter ? 0 : -1}
                    className="hana-gold-btn mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full py-2 text-[11px] font-bold"
                    style={{
                      opacity: isCenter ? 1 : 0,
                      pointerEvents: isCenter ? 'auto' : 'none',
                      transition: 'opacity 0.4s ease',
                    }}
                  >
                    Explore Product
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        </div>
        {/* RIGHT ARROW — fully outside the stage */}
        <button
          type="button"
          onClick={() => goTo(activeIdx + 1)}
          aria-label="Next product"
          className="shrink-0 flex h-11 w-11 items-center justify-center rounded-full border-none text-white text-2xl cursor-pointer transition-all duration-300 hover:scale-110"
          style={{ background: 'rgba(8,42,123,0.7)', paddingBottom: 4, paddingLeft: 3 }}
        >
          ›
        </button>

      </div>{/* end arrow+stage row */}

      {/* ── product name + category below ─────────────────── */}
      <div
        className="mt-4 text-center relative"
        style={{ transition: 'all 0.5s ease-out' }}
      >
        <h2
          className="relative inline-block font-bold text-white"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            opacity: nameVisible ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          {/* left line */}
          <span
            className="absolute"
            style={{
              top: '55%',
              left: -110,
              width: 90,
              height: 2,
              background: 'rgba(255,215,0,0.7)',
            }}
          />
          {active?.connectedTitle}
          {/* right line */}
          <span
            className="absolute"
            style={{
              top: '55%',
              right: -110,
              width: 90,
              height: 2,
              background: 'rgba(255,215,0,0.7)',
            }}
          />
        </h2>

      </div>

      {/* ── dots ──────────────────────────────────────────── */}
      <div className="mt-5 flex items-center justify-center gap-2.5">
        {products.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to ${p.title}`}
            className="rounded-full border-none cursor-pointer transition-all duration-300"
            style={{
              width: i === activeIdx ? 28 : 10,
              height: 10,
              background:
                i === activeIdx ? '#FFD700' : 'rgba(255,215,0,0.25)',
              transform: i === activeIdx ? 'scale(1.1)' : 'scale(1)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
