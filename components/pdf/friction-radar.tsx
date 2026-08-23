import { Circle, Line, Polygon, Svg, Text } from "@react-pdf/renderer";
import { PDF_FONT } from "@/lib/pdf-fonts";

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

function labelPosition(
  cx: number,
  cy: number,
  labelR: number,
  index: number,
  total: number,
) {
  const tip = polar(cx, cy, labelR, index, total);
  switch (index) {
    case 0:
      return { x: tip.x, y: tip.y - 6, textAnchor: "middle" as const };
    case 1:
      return { x: tip.x + 5, y: tip.y + 3, textAnchor: "start" as const };
    case 2:
      return { x: tip.x, y: tip.y + 11, textAnchor: "middle" as const };
    case 3:
      return { x: tip.x - 5, y: tip.y + 3, textAnchor: "end" as const };
    default:
      return { x: tip.x, y: tip.y, textAnchor: "middle" as const };
  }
}

export function PdfFrictionRadar({
  counts,
  labels,
  size = 160,
}: PdfFrictionRadarProps) {
  const labelPad = Math.max(44, Math.round(size * 0.28));
  const total = size + labelPad * 2;
  const cx = total / 2;
  const cy = total / 2;
  const maxR = size * 0.3;
  const labelR = maxR + labelPad * 0.82;
  const totalAxes = 4;
  const values = counts.map((count) => Math.min(3, Math.max(0, count)) / 3);

  const dataPoints = values
    .map((value, index) => {
      const point = polar(cx, cy, maxR * value, index, totalAxes);
      return `${point.x},${point.y}`;
    })
    .join(" ");

  return (
    <Svg width={total} height={total} viewBox={`0 0 ${total} ${total}`}>
      {[0.25, 0.5, 0.75, 1].map((scale) => (
        <Polygon
          key={scale}
          points={ringPoints(cx, cy, maxR * scale, totalAxes)}
          stroke={grid}
          strokeWidth={1}
          fill="none"
        />
      ))}
      {Array.from({ length: totalAxes }, (_, index) => {
        const tip = polar(cx, cy, maxR, index, totalAxes);
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
        const point = polar(cx, cy, maxR * value, index, totalAxes);
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
        const { x, y, textAnchor } = labelPosition(cx, cy, labelR, index, totalAxes);
        return (
          <Text
            key={`label-${index}`}
            x={x}
            y={y}
            fill={labelColor}
            textAnchor={textAnchor}
            style={{ fontSize: 7.5, fontFamily: PDF_FONT, fontWeight: 700 }}
          >
            {label}
          </Text>
        );
      })}
    </Svg>
  );
}
