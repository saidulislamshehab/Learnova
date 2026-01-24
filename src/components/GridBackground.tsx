import { useEffect, useRef } from 'react';

export function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Draw grid
    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const gridSize = 50;
      ctx.strokeStyle = 'rgba(165, 200, 158, 0.05)';
      ctx.lineWidth = 1;

      // Vertical lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    drawGrid();

    // Observe document height changes
    const observer = new MutationObserver(() => {
      resizeCanvas();
      drawGrid();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Canvas Grid */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
      />
      
      {/* Noise Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.015]">
        <div className="absolute inset-0 bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}></div>
      </div>

      {/* Glowing Dots */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#A5C89E] rounded-full blur-sm opacity-40 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-[#A5C89E] rounded-full blur-sm opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-2/3 left-1/2 w-2 h-2 bg-[#A5C89E] rounded-full blur-sm opacity-50 animate-pulse delay-500"></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-[#A5C89E] rounded-full blur-sm opacity-35 animate-pulse delay-1500"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-[#A5C89E] rounded-full blur-sm opacity-45 animate-pulse delay-700"></div>
        <div className="absolute top-3/4 right-1/2 w-2 h-2 bg-[#A5C89E] rounded-full blur-sm opacity-40 animate-pulse delay-1200"></div>
      </div>

      {/* Gradient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#A5C89E] rounded-full blur-[150px] opacity-[0.03]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#A5C89E] rounded-full blur-[150px] opacity-[0.02]"></div>
      </div>
    </>
  );
}
