/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { getQrMatrix } from '../../utils/qrcode';

interface QrCodeViewProps {
  text: string;
  size?: number;
  margin?: number;
  className?: string;
  quietZone?: boolean;
}

export function QrCodeView({
  text,
  size = 120,
  margin = 2,
  className = '',
  quietZone = true,
}: QrCodeViewProps) {
  const matrix = useMemo(() => {
    return getQrMatrix(text);
  }, [text]);

  const moduleCount = matrix.length;
  const totalCount = moduleCount + (quietZone ? margin * 2 : 0);
  const cellSize = 10; // SVG internal coordinate units
  const totalDimension = totalCount * cellSize;
  const offset = quietZone ? margin * cellSize : 0;

  return (
    <div
      className={`relative inline-flex items-center justify-center bg-white p-2 rounded-xl shadow-md ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox={`0 0 ${totalDimension} ${totalDimension}`}
        width="100%"
        height="100%"
        shapeRendering="crispEdges"
        className="block w-full h-full"
      >
        {/* Crisp white background */}
        <rect
          x="0"
          y="0"
          width={totalDimension}
          height={totalDimension}
          fill="#FFFFFF"
        />

        {/* Dark QR modules */}
        {matrix.map((row, r) =>
          row.map((isDark, c) => {
            if (!isDark) return null;
            return (
              <rect
                key={`${r}-${c}`}
                x={offset + c * cellSize}
                y={offset + r * cellSize}
                width={cellSize}
                height={cellSize}
                fill="#000000"
              />
            );
          })
        )}
      </svg>
    </div>
  );
}
