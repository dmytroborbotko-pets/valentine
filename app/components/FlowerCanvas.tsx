"use client";

import {
  useRef,
  useEffect,
  useImperativeHandle,
  useCallback,
  forwardRef,
} from "react";

const FLOWER_SRCS = [
  "/flowers/flower-1.png",
  "/flowers/flower-2.png",
  "/flowers/flower-3.png",
  "/flowers/flower-4.png",
];

const MAX_PARTICLES = 300;
const GRAVITY = 0.05;

interface Particle {
  el: HTMLImageElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  scale: number;
}

export interface FlowerCanvasHandle {
  spawnBurst: (x: number, y: number) => void;
  triggerFireworks: () => void;
}

const FlowerCanvas = forwardRef<FlowerCanvasHandle>(
  function FlowerCanvas(_props, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const rafRef = useRef<number>(0);
    const fallingIntervalRef = useRef<ReturnType<typeof setInterval>>(
      0 as unknown as ReturnType<typeof setInterval>,
    );
    const preloadedImagesRef = useRef<HTMLImageElement[]>([]);
    const isMobileRef = useRef(false);
    const fallingCountRef = useRef(0);

    const getRandomFlower = useCallback((): HTMLImageElement => {
      const idx = Math.floor(Math.random() * preloadedImagesRef.current.length);
      return preloadedImagesRef.current[idx].cloneNode(
        true,
      ) as HTMLImageElement;
    }, []);

    const tick = useCallback(() => {
      const particles = particlesRef.current;
      const container = containerRef.current;
      if (!container) return;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vy += GRAVITY;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.992;
        p.vy *= 0.992;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.003;

        if (p.opacity <= 0 || p.y > window.innerHeight + 100) {
          p.el.remove();
          particles.splice(i, 1);
          continue;
        }

        p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.rotation}deg) scale(${p.scale})`;
        p.el.style.opacity = String(p.opacity);
      }

      if (particles.length > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = 0;
      }
    }, []);

    const ensureLoop = useCallback(() => {
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }, [tick]);

    const spawnBurstParticles = useCallback(
      (x: number, y: number, count: number, velocityMultiplier: number) => {
        const container = containerRef.current;
        if (!container || preloadedImagesRef.current.length === 0) return;

        const currentCount = particlesRef.current.length;
        const allowed = Math.min(count, MAX_PARTICLES - currentCount);

        for (let i = 0; i < allowed; i++) {
          const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
          const magnitude = (1.5 + Math.random() * 3.5) * velocityMultiplier;
          const el = getRandomFlower();
          const scale = 0.5 + Math.random() * 0.55;

          el.style.position = "fixed";
          el.style.width = "150px";
          el.style.height = "150px";
          el.style.objectFit = "contain";
          el.style.pointerEvents = "none";
          el.style.zIndex = "20";
          el.style.left = "0";
          el.style.top = "0";
          el.style.willChange = "transform, opacity";

          container.appendChild(el);

          const particle: Particle = {
            el,
            x,
            y,
            vx: Math.cos(angle) * magnitude,
            vy: Math.sin(angle) * magnitude - 2,
            opacity: 1,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 3,
            scale,
          };

          el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
          particlesRef.current.push(particle);
        }

        ensureLoop();
      },
      [getRandomFlower, ensureLoop],
    );

    const spawnBurst = useCallback(
      (x: number, y: number) => {
        const count = isMobileRef.current ? 6 : 12;
        spawnBurstParticles(x, y, count, 1);
      },
      [spawnBurstParticles],
    );

    const triggerFireworks = useCallback(() => {
      const burstCount = 10;
      const particlesPerBurst = isMobileRef.current ? 12 : 25;

      for (let i = 0; i < burstCount; i++) {
        setTimeout(() => {
          const x =
            Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1;
          const y =
            Math.random() * window.innerHeight * 0.6 + window.innerHeight * 0.1;
          spawnBurstParticles(x, y, particlesPerBurst, 1.4);
        }, i * 300);
      }
    }, [spawnBurstParticles]);

    useImperativeHandle(ref, () => ({ spawnBurst, triggerFireworks }), [
      spawnBurst,
      triggerFireworks,
    ]);

    // Snowfall — spawns CSS-animated falling flowers
    const spawnFallingFlower = useCallback(() => {
      const container = containerRef.current;
      if (!container || preloadedImagesRef.current.length === 0) return;
      if (fallingCountRef.current >= 80) return;

      const el = getRandomFlower();
      const x = Math.random() * window.innerWidth;
      const scale = 0.45 + Math.random() * 0.5;
      const duration = 6 + Math.random() * 5;
      const swayAmount = 25 + Math.random() * 50;
      const swayDuration = 3 + Math.random() * 3;

      el.className = "falling-flower";
      el.style.left = `${x}px`;
      el.style.width = "140px";
      el.style.height = "140px";
      el.style.objectFit = "contain";
      el.style.setProperty("--flower-scale", String(scale));
      el.style.setProperty("--flower-duration", `${duration}s`);
      el.style.setProperty("--flower-sway", `${swayAmount}px`);
      el.style.setProperty("--flower-sway-duration", `${swayDuration}s`);

      container.appendChild(el);
      fallingCountRef.current++;

      const handleEnd = () => {
        el.removeEventListener("animationend", handleEnd);
        el.remove();
        fallingCountRef.current--;
      };
      el.addEventListener("animationend", handleEnd);
    }, [getRandomFlower]);

    useEffect(() => {
      isMobileRef.current = window.innerWidth < 640;
      const container = containerRef.current;

      // Preload images
      const images: HTMLImageElement[] = [];
      let loaded = 0;

      FLOWER_SRCS.forEach((src) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          loaded++;
          if (loaded === FLOWER_SRCS.length) {
            preloadedImagesRef.current = images;
            // Start snowfall once images are ready
            fallingIntervalRef.current = setInterval(
              spawnFallingFlower,
              isMobileRef.current ? 300 : 180,
            );
          }
        };
        images.push(img);
      });

      return () => {
        clearInterval(fallingIntervalRef.current);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        if (container) {
          while (container.firstChild) {
            container.removeChild(container.firstChild);
          }
        }
        particlesRef.current = [];
      };
    }, [spawnFallingFlower]);

    return (
      <div
        ref={containerRef}
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 10,
          overflow: "hidden",
        }}
      />
    );
  },
);

export default FlowerCanvas;
