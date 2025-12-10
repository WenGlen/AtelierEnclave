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
  clusterDensity?: number; // 密集區中心點密度（約5-20個）
  spreadRadius?: number; // 擴散半徑（相對於畫布尺寸的比例，0-1之間）
}

export default function Noise_StackingUneven({ 
  size = "",
  children,
  backgroundColor = "",
  pointDensity = 50,
  pointMinSize = 0.5,
  pointMaxSize = 1.2,
  pointColor = "hsla(95, 29.00%, 54.70%, 0.15)",
  clusterDensity = 30, // 分佈中心點數量
  spreadRadius = 0.02, // 擴散半徑相對於畫布尺寸
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

      // 計算擴散半徑（以畫布對角線為基準）
      const diagonal = Math.sqrt(width * width + height * height);
      const maxSpreadRadius = diagonal * spreadRadius;
      const maxSpreadRadiusSq = maxSpreadRadius * maxSpreadRadius;

      // 第一次繪製：生成密集區中心點
      const clusterCount = Math.max(1, Math.floor(clusterDensity));
      const clusters: Array<{ x: number; y: number }> = [];
      
      for (let i = 0; i < clusterCount; i++) {
        clusters.push({
          x: Math.random() * width,
          y: Math.random() * height,
        });
      }

      // 計算要繪製的點數
      const pointCount = Math.floor((width * height * pointDensity) / 1000);

      // 第二次繪製：以中心點為基準向外擴散繪製點
      for (let i = 0; i < pointCount; i++) {
        // 隨機生成候選點位置
        const x = Math.random() * width;
        const y = Math.random() * height;

        // 計算到最近中心點的距離
        let minDistanceSq = Infinity;
        for (const cluster of clusters) {
          const dx = x - cluster.x;
          const dy = y - cluster.y;
          const distanceSq = dx * dx + dy * dy;
          if (distanceSq < minDistanceSq) {
            minDistanceSq = distanceSq;
            // 如果距離非常近，提前退出以優化性能
            if (distanceSq < maxSpreadRadiusSq * 0.01) break;
          }
        }

        // 計算出現機率：距離越近機率越高，使用高斯衰減函數
        // probability = exp(-distance^2 / (2 * sigma^2))
        // 為了性能優化，使用簡化版本：probability = 1 / (1 + (distance^2 / radius^2))
        const normalizedDistanceSq = minDistanceSq / maxSpreadRadiusSq;
        const probability = 1 / (1 + normalizedDistanceSq * 3); // 3是調整係數，控制衰減速度

        // 根據機率決定是否繪製此點
        if (Math.random() < probability) {
          const radius = pointMinSize + Math.random() * (pointMaxSize - pointMinSize);
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    drawPoints();

    const resizeObserver = new ResizeObserver(drawPoints);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [pointDensity, pointMinSize, pointMaxSize, pointColor, clusterDensity, spreadRadius]);

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

