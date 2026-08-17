"use client";

import { useEffect, useRef } from "react";
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Legend, Tooltip);

export function SlaBarChart({
  p1Hours,
  p2Days,
}: {
  p1Hours: number;
  p2Days: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!chartRef.current) {
      chartRef.current = new Chart(canvas, {
        type: "bar",
        data: {
          labels: ["P1: Critical (Hrs)", "P2: Standard (Days × 8h)"],
          datasets: [
            {
              label: "Baseline friction state",
              data: [24, 32],
              backgroundColor: "#94a3b8",
            },
            {
              label: "Target agreement SLA",
              data: [p1Hours, p2Days * 8],
              backgroundColor: "#1e40af",
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Hours to response",
                font: { size: 10 },
              },
              grid: { color: "#f1f5f9" },
            },
            x: { grid: { display: false } },
          },
          plugins: {
            legend: { position: "bottom", labels: { font: { size: 10 } } },
          },
        },
      });
    }

    const chart = chartRef.current;
    chart.data.datasets[1].data = [p1Hours, p2Days * 8];
    chart.update();
  }, [p1Hours, p2Days]);

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
