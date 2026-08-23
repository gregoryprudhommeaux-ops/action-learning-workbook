import { Circle, Line, Polygon, Svg, Text } from "@react-pdf/renderer";

const brand = "#1e40af";
const grid = "#e2e8f0";
const labelColor = "#334155";

type PdfFrictionRadarProps = {
  counts: [number, number, number, number];
  labels: [string, string, string, string];
  size?: number;
};

function polar(cx: number, cy: number, radius: number, index: number, total: number) {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / total;
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

function ringPoints(cx: number, cy: number, radius: number, total: number) {
  return Array.from({ length: total }, (_, index) => {
    const point = polar(cx, cy, radius, index, total);
    return `${point.x},${point.y}`;
  }).join(" ");
}

export function PdfFrictionRadar({
  counts,
  labels,
  size = 180,
}: PdfFrictionRadarProps) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.32;
  const total = 4;
  const values = counts.map((count) => Math.min(3, Math.max(0, count)) / 3);

  const dataPoints = values
    .map((value, index) => {
      const point = polar(cx, cy, maxR * value, index, total);
      return `${point.x},${point.y}`;
    })
    .join(" ");

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[0.25, 0.5, 0.75, 1].map((scale) => (
        <Polygon
          key={scale}
          points={ringPoints(cx, cy, maxR * scale, total)}
          stroke={grid}
          strokeWidth={1}
          fill="none"
        />
      ))}
      {Array.from({ length: total }, (_, index) => {
        const tip = polar(cx, cy, maxR, index, total);
        return (
          <Line
            key={`axis-${index}`}
            x1={cx}
            y1={cy}
            x2={tip.x}
            y2={tip.y}
            stroke={grid}
            strokeWidth={1}
          />
        );
      })}
      <Polygon
        points={dataPoints}
        fill={brand}
        fillOpacity={0.22}
        stroke={brand}
        strokeWidth={2}
      />
      {values.map((value, index) => {
        const point = polar(cx, cy, maxR * value, index, total);
        return (
          <Circle
            key={`pt-${index}`}
            cx={point.x}
            cy={point.y}
            r={2.5}
            fill={brand}
            stroke="#ffffff"
            strokeWidth={1}
          />
        );
      })}
      {labels.map((label, index) => {
        const tip = polar(cx, cy, maxR + size * 0.12, index, total);
        const anchor =
          index === 0 ? "middle" : index === 1 ? "start" : index === 2 ? "middle" : "end";
        return (
          <Text
            key={`label-${index}`}
            x={tip.x}
            y={tip.y}
            fill={labelColor}
            textAnchor={anchor}
            style={{ fontSize: 7 }}
          >
            {label}
          </Text>
        );
      })}
    </Svg>
  );
}
