"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface BrandedBackgroundProps {
  children?: React.ReactNode;
}

// Define Particle type outside of useEffect to fix TypeScript issues
type ParticleType = {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  update: (canvasWidth: number, canvasHeight: number) => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
};

export default function BrandedBackground({
  children,
}: BrandedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Initialize canvas
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Configure particle settings
    const particlesArray: ParticleType[] = [];
    const numberOfParticles = Math.min(50, window.innerWidth / 30);

    // Create a particle
    const createParticle = (): ParticleType => {
      // Safe access to canvas dimensions
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Color palette based on our theme
      const colors = [
        "rgba(0, 198, 188, 0.2)", // teal
        "rgba(0, 117, 255, 0.2)", // blue
        "rgba(139, 92, 246, 0.2)", // purple
        "rgba(244, 63, 94, 0.15)", // red
      ];

      return {
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        size: Math.random() * 5 + 1,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.1,

        update(canvasWidth: number, canvasHeight: number) {
          this.x += this.speedX;
          this.y += this.speedY;

          // Bounce off edges
          if (this.x > canvasWidth || this.x < 0) {
            this.speedX = -this.speedX;
          }
          if (this.y > canvasHeight || this.y < 0) {
            this.speedY = -this.speedY;
          }
        },

        draw(ctx: CanvasRenderingContext2D) {
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        },
      };
    };

    // Create particles
    const init = () => {
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(createParticle());
      }
    };

    init();

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid pattern
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;

      const gridSize = 50;

      // Vertical lines
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Add radial gradient overlay
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
      );

      gradient.addColorStop(0, "rgba(0, 198, 188, 0.05)");
      gradient.addColorStop(0.5, "rgba(0, 117, 255, 0.03)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesArray.forEach((particle) => {
        particle.update(canvas.width, canvas.height);
        particle.draw(ctx);
      });

      // Connect nearby particles with lines
      connect();

      requestAnimationFrame(animate);
    };

    // Draw lines between nearby particles
    const connect = () => {
      if (!ctx) return;

      let opacity = 1;

      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            opacity = 1 - distance / 100;
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.1})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background canvas - only visible in dark mode */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full dark:block hidden -z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(9, 16, 31, 0.9), rgba(15, 23, 42, 0.95))",
        }}
      />

      {/* Light mode background */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-cyan-100 to-teal-100 dark:hidden -z-10">
        {/* Subtle light pattern for light mode */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(0, 117, 255, 0.3) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Moving background shapes - Blob 1 */}
      <motion.div
        className="absolute opacity-30 blur-3xl"
        style={{
          top: "10%",
          left: "10%",
          width: "40vw",
          height: "40vw",
          maxWidth: "600px",
          maxHeight: "600px",
          background:
            "radial-gradient(circle at center, rgba(0, 198, 188, 0.3), rgba(0, 198, 188, 0) 70%)",
          zIndex: -5,
        }}
        animate={{
          x: [0, 20, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "easeInOut",
        }}
      />

      {/* Moving background shapes - Blob 2 */}
      <motion.div
        className="absolute opacity-30 blur-3xl"
        style={{
          bottom: "10%",
          right: "10%",
          width: "50vw",
          height: "50vw",
          maxWidth: "700px",
          maxHeight: "700px",
          background:
            "radial-gradient(circle at center, rgba(0, 117, 255, 0.3), rgba(0, 117, 255, 0) 70%)",
          zIndex: -5,
        }}
        animate={{
          x: [0, -30, 0],
          y: [0, 30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 25,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Subtle wave effect at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-64 opacity-10 overflow-hidden z-0">
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{
            background:
              "linear-gradient(to right, rgba(0, 198, 188, 0.3), rgba(0, 117, 255, 0.3), rgba(139, 92, 246, 0.3))",
            maskImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' fill='%23FFFFFF'/%3E%3C/svg%3E\")",
            maskSize: "cover",
            maskRepeat: "no-repeat",
          }}
          animate={{
            x: ["-100%", "0%"],
          }}
          transition={{
            repeat: Infinity,
            duration: 25,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-24"
          style={{
            background:
              "linear-gradient(to left, rgba(0, 198, 188, 0.2), rgba(0, 117, 255, 0.2), rgba(139, 92, 246, 0.2))",
            maskImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z' fill='%23FFFFFF'/%3E%3C/svg%3E\")",
            maskSize: "cover",
            maskRepeat: "no-repeat",
          }}
          animate={{
            x: ["0%", "-100%"],
          }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "linear",
          }}
        />
      </div>

      {/* Content wrapper */}
      {children}
    </div>
  );
}
