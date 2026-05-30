'use client';

import React from 'react';

interface RiasecChartProps {
  scores: {
    R: number;
    I: number;
    A: number;
    S: number;
    E: number;
    C: number;
  };
}

export function RiasecChart({ scores }: RiasecChartProps) {
  // Config
  const size = 300;
  const center = size / 2;
  const maxScore = 25; // 5 items * 5 max score = 25
  const maxRadius = 100;

  const dimensions: { key: 'R' | 'I' | 'A' | 'S' | 'E' | 'C'; label: string }[] = [
    { key: 'R', label: 'R (Realistic)' },
    { key: 'I', label: 'I (Investigative)' },
    { key: 'A', label: 'A (Artistic)' },
    { key: 'S', label: 'S (Social)' },
    { key: 'E', label: 'E (Enterprising)' },
    { key: 'C', label: 'C (Conventional)' }
  ];

  // Helper to get X and Y for a given index and radius
  const getCoordinates = (index: number, radius: number) => {
    // Start from top (-90 degrees) and rotate clockwise in 60-degree steps (Math.PI / 3)
    const angle = -Math.PI / 2 + (index * Math.PI) / 3;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y };
  };

  // Generate background grid lines (5 concentric hexagons)
  const gridLevels = [5, 10, 15, 20, 25];
  const gridHexagons = gridLevels.map((level) => {
    const radius = (level / maxScore) * maxRadius;
    const points = dimensions.map((_, i) => {
      const { x, y } = getCoordinates(i, radius);
      return `${x},${y}`;
    }).join(' ');
    return { points, level };
  });

  // Generate spoke lines (from center to each vertex)
  const spokeLines = dimensions.map((_, i) => {
    const { x, y } = getCoordinates(i, maxRadius);
    return { x1: center, y1: center, x2: x, y2: y };
  });

  // Calculate actual score polygon coordinates
  const scorePoints = dimensions.map((d, i) => {
    const score = Math.max(5, Math.min(maxScore, scores[d.key])); // Range 5-25
    const radius = (score / maxScore) * maxRadius;
    const { x, y } = getCoordinates(i, radius);
    return { x, y, label: `${d.key}: ${score}` };
  });

  const polygonPath = scorePoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="flex flex-col items-center justify-center bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/40 shadow-sm w-full max-w-sm mx-auto">
      <h4 className="text-sm font-semibold text-primary mb-2 font-heading tracking-wide">
        DIAGRAM RADAR RIASEC
      </h4>
      <div className="relative w-full aspect-square max-w-[280px]">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
          {/* Background Grid Hexagons */}
          {gridHexagons.map((hex, idx) => (
            <polygon
              key={idx}
              points={hex.points}
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="1"
              strokeDasharray={idx === 4 ? "none" : "3,3"}
            />
          ))}

          {/* Level Markers (Value text on the vertical axis) */}
          {gridLevels.map((level) => {
            const radius = (level / maxScore) * maxRadius;
            return (
              <text
                key={level}
                x={center + 5}
                y={center - radius + 4}
                fill="#94A3B8"
                fontSize="9"
                className="select-none font-medium"
              >
                {level}
              </text>
            );
          })}

          {/* Spoke Lines */}
          {spokeLines.map((spoke, idx) => (
            <line
              key={idx}
              x1={spoke.x1}
              y1={spoke.y1}
              x2={spoke.x2}
              y2={spoke.y2}
              stroke="#E2E8F0"
              strokeWidth="1"
            />
          ))}

          {/* Score Area Polygon */}
          {polygonPath && (
            <polygon
              points={polygonPath}
              fill="rgba(123, 160, 138, 0.4)" // Sage green translucent
              stroke="var(--color-secondary)"
              strokeWidth="2.5"
              className="transition-all duration-500 ease-in-out"
            />
          )}

          {/* Score Vertices/Markers */}
          {scorePoints.map((p, idx) => (
            <circle
              key={idx}
              cx={p.x}
              cy={p.y}
              r="4.5"
              fill="var(--color-primary)"
              stroke="white"
              strokeWidth="1.5"
              className="cursor-pointer hover:r-6 transition-all shadow-sm"
            >
              <title>{p.label}</title>
            </circle>
          ))}

          {/* Dimension Labels */}
          {dimensions.map((d, i) => {
            const { x, y } = getCoordinates(i, maxRadius + 18);
            
            // Adjust text anchors based on position
            let textAnchor: 'middle' | 'start' | 'end' = 'middle';
            let dy = '0.35em';
            
            const angle = -90 + i * 60;
            if (angle === -90 || angle === 90) {
              textAnchor = 'middle';
            } else if (angle > -90 && angle < 90) {
              textAnchor = 'start';
            } else {
              textAnchor = 'end';
            }

            if (angle === -90) dy = '-0.4em';
            if (angle === 90) dy = '1em';

            return (
              <text
                key={d.key}
                x={x}
                y={y}
                textAnchor={textAnchor}
                dy={dy}
                fill="var(--color-primary)"
                fontSize="10"
                fontWeight="700"
                className="select-none font-heading"
              >
                {d.label}
              </text>
            );
          })}
        </svg>
      </div>
      
      {/* Mini Legend */}
      <div className="grid grid-cols-3 gap-2 mt-2 w-full text-xxs font-medium text-text-dark text-center">
        {dimensions.map(d => (
          <div key={d.key} className="bg-bg-warm rounded-md py-1 px-1.5 border border-primary/5">
            <span className="font-bold text-secondary mr-1">{d.key}</span>
            <span className="text-primary font-semibold">{scores[d.key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
export default RiasecChart;
