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
import { useLocale } from "@/components/locale-provider";

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler);

export function FrictionRadar({
  counts,
}: {
  counts: [number, number, number, number];
}) {
  const { t, locale } = useLocale();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const labels = [
      t("radar.clock"),
      t("radar.voice"),
      t("radar.message"),
      t("radar.power"),
    ];
    const datasetLabel = t("radar.dataset");

    const labelSize =
      typeof window !== "undefined" && window.innerWidth < 480 ? 9 : 11;

    if (!chartRef.current) {
      chartRef.current = new Chart(canvas, {
        type: "radar",
        data: {
          labels,
          datasets: [
            {
              label: datasetLabel,
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
                font: { size: labelSize, weight: 600 },
                color: "#334155",
              },
            },
          },
          plugins: { legend: { display: false } },
        },
      });
    } else {
      const chart = chartRef.current;
      chart.data.labels = labels;
      if (chart.data.datasets[0]) {
        chart.data.datasets[0].label = datasetLabel;
        chart.data.datasets[0].data = counts.map((count) => count * 33.3);
      }
      const scale = chart.options.scales?.r;
      if (scale && "pointLabels" in scale && scale.pointLabels) {
        scale.pointLabels.font = { size: labelSize, weight: 600 };
      }
      chart.update();
    }
  }, [counts, locale, t]);

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
