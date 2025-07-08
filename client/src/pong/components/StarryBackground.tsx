import { useEffect, useRef } from "react";

/*
  tuning 
  -----------------------------------------------------------
  • STAR_DENSITY        – stars per CSS‑pixel² (0.00015 ≈ 180 stars on 1920×1080).
  • Radius distribution – const r = 0.5 + Math.pow(Math.random(), 5) * 1.5;
                            ↑ exponent – higher ⇒ fewer big stars, more tiny dust.
  • SPEED_RANGE         – drift speed in visual px / s.
  • TWINKLE_RANGE       – period of subtle brightness pulse, in seconds.
  • Glow sprite size    – inside makeSprite(): sprite = r * 5, halo = r * 2.5.
  • Colour palette      – hue around 200° (cool white) ± 15°, 60 % saturation.
*/

// ---------------------------------------------------------------------------
// CONFIG --------------------------------------------------------------------
// ---------------------------------------------------------------------------
const STAR_DENSITY   = 0.00038;  
const SPEED_RANGE    = [.3, 1]; // slow drift
const TWINKLE_RANGE  = [3, 12];    // long pulse

// ---------------------------------------------------------------------------
interface Star {
  xn: number; yn: number; r: number; tw: number; phase: number;
  vxPx: number; vyPx: number; sprite: HTMLCanvasElement;
}

// ---------------------------------------------------------------------------
// PRE‑RENDERED SPRITE --------------------------------------------------------
// ---------------------------------------------------------------------------
// const makeSprite = (r: number, hue: number): HTMLCanvasElement => {
//   const size = Math.ceil(r * 5);                // sprite canvas (halo+core)
//   const c = document.createElement("canvas");
//   c.width = c.height = size;
//   const ctx = c.getContext("2d")!;

//   const g = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, r * 2.5);
//   g.addColorStop(0, `hsla(${hue},60%,100%,1)`); 
//   g.addColorStop(1, `hsla(${hue},60%,85%,0)`); 
//   ctx.fillStyle = g;
//   ctx.fillRect(0, 0, size, size);
  
//   return c;
// };


// simplified sprite without blur
const makeSprite = (r: number, hue: number): HTMLCanvasElement => {

  const size = Math.ceil(r * 2);
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;


  ctx.fillStyle = `hsla(${hue},60%,100%,1)`;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, r, 0, Math.PI * 2);
  ctx.fill();

  return c;
};


// ---------------------------------------------------------------------------
export function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef  = useRef<Star[]>([]);
  const rafId     = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;
    const dpr    = window.devicePixelRatio || 1;

    // ---------- resize helper ---------------------------------------------
    const fitCanvas = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); 
    };

    // ---------- star factory ----------------------------------------------
    const makeStar = (): Star => {
      const [sMin, sMax] = SPEED_RANGE;
      //const speedPx = sMin + Math.random() * (sMax - sMin);
      const r   = 0.5 + Math.pow(Math.random(), 1.5) * 1.5; // higher value => fewer big stars
      const hue = 200 + (Math.random() - 0.5) * 30;       // 185‑215° 
      const angle = Math.random() * Math.PI * 2;     // flight direction
      const speed = sMin + Math.random() * (sMax - sMin); // speed in px/s

      return {
        xn: Math.random(),
        yn: Math.random(),
        r,
        tw: TWINKLE_RANGE[0] + Math.random() * (TWINKLE_RANGE[1] - TWINKLE_RANGE[0]),
        phase: Math.random() * Math.PI * 2,
        vxPx: Math.cos(angle) * speed,
        vyPx: Math.sin(angle) * speed,
        sprite: makeSprite(r, hue),
      };
    };

    // ---------- initial setup ---------------------------------------------
    fitCanvas();

    const targetCount = () =>
      Math.round(window.innerWidth * window.innerHeight * STAR_DENSITY);

    const stars = starsRef.current;
    while (stars.length < targetCount()) stars.push(makeStar());

    // ---------- animation loop -------------------------------------------
    let prev = performance.now();
    const PREFERS_REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const loop = (t: number) => {
      if (document.hidden || PREFERS_REDUCED) {
        prev = t;
        rafId.current = requestAnimationFrame(loop);
        return;
      }
      const dt = (t - prev) / 1000;
      prev = t;

      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      for (const s of stars) {
        s.xn = (s.xn + (s.vxPx * dt) / window.innerWidth  + 1) % 1;
        s.yn = (s.yn + (s.vyPx * dt) / window.innerHeight + 1) % 1;
        const progress = ((t / 1000) + s.phase) / s.tw;
        const alpha = 0.5 * (1 + Math.sin(progress * Math.PI * 2));
        ctx.globalAlpha = alpha;
        ctx.drawImage(
          s.sprite,
          s.xn * window.innerWidth  - s.sprite.width  / 2,
          s.yn * window.innerHeight - s.sprite.height / 2
        );
      }
      ctx.globalAlpha = 1;
      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);

    // ---------- adaptive resize ------------------------------------------
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        fitCanvas();
        const need = targetCount();
        if (stars.length < need) while (stars.length < need) stars.push(makeStar());
        else if (stars.length > need) stars.length = need;
      }, 120);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 -z-10 bg-inherit" />;
}
