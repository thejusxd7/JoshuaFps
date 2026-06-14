import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  alpha: number;
  decay: number;
  pulseSpeed: number;
  pulseTimer: number;
}

export default function RedParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: entryWidth, height: entryHeight } = entry.contentRect;
        width = entryWidth;
        height = entryHeight;
        canvas.width = entryWidth;
        canvas.height = entryHeight;
        initParticles();
      }
    });

    const particles: Particle[] = [];
    const maxParticles = 65;

    function createParticle(isInitial = false): Particle {
      return {
        x: Math.random() * width,
        y: isInitial ? Math.random() * height : height + 10,
        size: Math.random() * 3.5 + 0.8,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -(Math.random() * 0.8 + 0.2),
        alpha: Math.random() * 0.5 + 0.15,
        decay: 0.0003,
        pulseSpeed: 0.01 + Math.random() * 0.02,
        pulseTimer: Math.random() * Math.PI * 2,
      };
    }

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < maxParticles; i++) {
        particles.push(createParticle(true));
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    resizeObserver.observe(canvas.parentElement || document.body);

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);

      // Update and draw particles
      particles.forEach((p, idx) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.pulseTimer += p.pulseSpeed;

        // Interactive mouse repulsion/magnetism
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.x -= (dx / dist) * force * 1.5;
          p.y -= (dy / dist) * force * 1.5;
        }

        // Pulse the size
        const pulsingSize = p.size * (1 + Math.sin(p.pulseTimer) * 0.25);

        // Highly optimized glow simulation via layered circles (completely lag-free)
        if (pulsingSize > 1.8) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, pulsingSize * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(239, 68, 68, ${p.alpha * 0.25})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, pulsingSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(239, 68, 68, ${p.alpha})`;
        ctx.fill();

        // Recycle if goes off screen
        if (p.y < -10 || p.x < -10 || p.x > width + 10) {
          particles[idx] = createParticle(false);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      if (canvas) {
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block pointer-events-none -z-10"
      id="red-particles-canvas"
    />
  );
}
