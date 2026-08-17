"use client";

import { useEffect, useRef } from "react";
import {
  Chart,
  Filler,
  LineElement,
  PointElement,
  RadarController,
  RadialLinearScale,
} from "chart.js";

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler);

export function FrictionRadar({
  counts,
}: {
  counts: [number, number, number, number];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!chartRef.current) {
      chartRef.current = new Chart(canvas, {
        type: "radar",
        data: {
          labels: [
            "Clock & Time",
            "Voice & Trust",
            "Message Clarity",
            "Power & Hierarchy",
          ],
          datasets: [
            {
              label: "Project Friction Level (%)",
              data: counts.map((count) => count * 33.3),
              backgroundColor: "rgba(30, 64, 175, 0.2)",
              borderColor: "#1e40af",
              borderWidth: 2,
              pointBackgroundColor: "#1e40af",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "#1e40af",
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          scales: {
            r: {
              min: 0,
              max: 100,
              ticks: { display: false, stepSize: 25 },
              grid: { color: "#e2e8f0" },
              pointLabels: {
                font: { size: 11, weight: 600 },
                color: "#334155",
              },
            },
          },
          plugins: { legend: { display: false } },
        },
      });
    }

    const chart = chartRef.current;
    chart.data.datasets[0].data = counts.map((count) => count * 33.3);
    chart.update();
  }, [counts]);

  useEffect(() => {
    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, []);

  return (
    <div className="chart-container">
      <canvas ref={canvasRef} />
    </div>
  );
}
