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
import { useLocale } from "@/components/locale-provider";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Legend, Tooltip);

export function SlaBarChart({
  p1BaselineHours,
  p2BaselineDays,
  p1Hours,
  p2Days,
}: {
  p1BaselineHours: number;
  p2BaselineDays: number;
  p1Hours: number;
  p2Days: number;
}) {
  const { t, locale } = useLocale();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const labels = [t("chart.p1"), t("chart.p2")];
    const baseline = t("chart.baseline");
    const target = t("chart.target");
    const hours = t("chart.hours");

    if (!chartRef.current) {
      chartRef.current = new Chart(canvas, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: baseline,
              data: [p1BaselineHours, p2BaselineDays * 8],
              backgroundColor: "#94a3b8",
            },
            {
              label: target,
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
                text: hours,
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
    } else {
      const chart = chartRef.current;
      chart.data.labels = labels;
      if (chart.data.datasets[0]) {
        chart.data.datasets[0].label = baseline;
        chart.data.datasets[0].data = [p1BaselineHours, p2BaselineDays * 8];
      }
      if (chart.data.datasets[1]) {
        chart.data.datasets[1].label = target;
        chart.data.datasets[1].data = [p1Hours, p2Days * 8];
      }
      if (chart.options.scales?.y && "title" in chart.options.scales.y) {
        const y = chart.options.scales.y;
        if (y.title) y.title.text = hours;
      }
      chart.update();
    }
  }, [p1BaselineHours, p2BaselineDays, p1Hours, p2Days, locale, t]);

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
