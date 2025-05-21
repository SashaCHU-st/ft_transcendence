// import { useEffect, useRef } from "react";

// export function StarryBackground() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;

//     const stars: { x: number; y: number; radius: number; alpha: number; fading: boolean }[] = [];
//     const numStars = 100;

//     // Initialize stars
//     for (let i = 0; i < numStars; i++) {
//       stars.push({
//         x: Math.random() * canvas.width,
//         y: Math.random() * canvas.height,
//         radius: Math.random() * 1.5 + 0.5,
//         alpha: Math.random(),
//         fading: Math.random() > 0.5,
//       });
//     }

//     // Animation loop
//     const animate = () => {
//       ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
//       ctx.fillRect(0, 0, canvas.width, canvas.height);

//       stars.forEach((star) => {
//         ctx.beginPath();
//         ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
//         ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
//         ctx.fill();

//         // Update alpha for fading effect
//         star.alpha += star.fading ? -0.005 : 0.005;
//         if (star.alpha <= 0) {
//           star.fading = false;
//           star.alpha = 0;
//         } else if (star.alpha >= 1) {
//           star.fading = true;
//           star.alpha = 1;
//         }

//         // Occasionally reposition star
//         if (Math.random() < 0.0001) {
//           star.x = Math.random() * canvas.width;
//           star.y = Math.random() * canvas.height;
//           star.radius = Math.random() * 1.5 + 0.5;
//           star.alpha = Math.random();
//           star.fading = Math.random() > 0.5;
//         }
//       });

//       requestAnimationFrame(animate);
//     };

//     animate();

//     // Handle window resize
//     const handleResize = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//     };
//     window.addEventListener("resize", handleResize);

//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="absolute inset-0 z-[-1]"
//     />
//   );
// }



import { useEffect, useRef } from "react";

export function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

	// Resize canvas to fill the window
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    interface Star {
      x: number;
      y: number;
      radius: number;
      alpha: number;
      fading: boolean;
    }

    const stars: Star[] = [];
    const numStars = 100;

    // Initialize stars at random positions
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random(),
        fading: Math.random() > 0.5,
      });
    }

    const animate = () => {
      // Clear the canvas for a transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw each star
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();

        /// Update alpha for twinkling effect
        star.alpha += star.fading ? -0.005 : 0.005;
        if (star.alpha <= 0) {
          star.alpha = 0;
          star.fading = false;
        } else if (star.alpha >= 1) {
          star.alpha = 1;
          star.fading = true;
        }

        // Occasionally reposition stars to avoid them staying static
        if (Math.random() < 0.0001) {
          star.x = Math.random() * canvas.width;
          star.y = Math.random() * canvas.height;
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
}
