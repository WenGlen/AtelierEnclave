import { useRef, useEffect } from "react";
import type { ReactNode } from "react";

interface NoiseProps {
  size?: string;
  children?: ReactNode;
  className?: string;
  backgroundColor?: string;
  pointDensity?: number;
  pointMinSize?: number;
  pointMaxSize?: number;
  pointColor?: string;
}

export default function Noise_StackingSingleColorPoints({ 
  size = "",
  children,
  backgroundColor = "",
  pointDensity = 15,
  pointMinSize = 0.3,
  pointMaxSize = 0.6,
  pointColor = "hsla(140, 20%, 40%, 0.4)",
}: NoiseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const drawPoints = () => {
      // 抓容器尺寸
      const { width, height } = container.getBoundingClientRect();
      if (width === 0 || height === 0) return;

      // 設定畫布尺寸
      canvas.width = width;
      canvas.height = height;

      // 抓畫布上下文
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 設定填充顏色、透明度、混合模式
      ctx.fillStyle = pointColor;
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;

      const pointCount = Math.floor((width * height * pointDensity) / 1000);

      // 繪製點
      for (let i = 0; i < pointCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = pointMinSize + Math.random() * (pointMaxSize - pointMinSize);

        // 繪製圓形
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    drawPoints();

    const resizeObserver = new ResizeObserver(drawPoints);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [pointDensity, pointMinSize, pointMaxSize, pointColor]);

  return (
    <div 
      ref={containerRef}
      className={`${size} ${backgroundColor} relative overflow-hidden`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />
      <div className="relative z-10 pointer-events-auto">
        {children}
      </div>
    </div>
  );
}

