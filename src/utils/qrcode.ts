/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import qrcode from 'qrcode-generator';
import { AttendeeInfo } from '../types';

/**
 * Safely creates a qrcode instance that automatically scales to the payload size
 */
export function getSafeQrInstance(text: string): ReturnType<typeof qrcode> {
  const cleanText = text || 'BADGEVERSE 2026';
  const errorLevels: ('M' | 'L')[] = ['M', 'L'];

  // Try auto-detect (Type 0) first
  for (const errLevel of errorLevels) {
    try {
      const qr = qrcode(0, errLevel);
      qr.addData(cleanText, 'Byte');
      qr.make();
      return qr;
    } catch {
      // try without 'Byte' mode if needed
      try {
        const qr = qrcode(0, errLevel);
        qr.addData(cleanText);
        qr.make();
        return qr;
      } catch {
        // continue
      }
    }
  }

  // Fallback: search across all standard QR types (1 to 40)
  for (let type = 1; type <= 40; type++) {
    for (const errLevel of errorLevels) {
      try {
        const qr = qrcode(type as TypeNumber, errLevel);
        qr.addData(cleanText, 'Byte');
        qr.make();
        return qr;
      } catch {
        // continue
      }
    }
  }

  // Extreme fallback: minimal QR
  const fallback = qrcode(4, 'L');
  fallback.addData('BADGEVERSE');
  fallback.make();
  return fallback;
}

/**
 * Builds a valid, compliant vCard 3.0 specification string for scanning with smartphones
 */
export function buildVCardPayload(info: AttendeeInfo, archetypeName?: string): string {
  const cleanFirst = (info.firstName || '').trim().replace(/;/g, ' ') || 'Cosmic';
  const cleanLast = (info.lastName || '').trim().replace(/;/g, ' ') || 'Explorer';
  const fullName = `${cleanFirst} ${cleanLast}`.trim();
  const cleanEmail = (info.email || '').trim() || 'traveler@badgeverse.id';

  // Format Twitter URL
  let twitterUrl = '';
  if (info.twitter && info.twitter.trim()) {
    const handle = info.twitter.trim().replace(/^@/, '');
    twitterUrl = `https://twitter.com/${handle}`;
  }

  // Format GitHub URL
  let githubUrl = '';
  if (info.github && info.github.trim()) {
    const handle = info.github.trim().replace(/^@/, '');
    githubUrl = `https://github.com/${handle}`;
  }

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${cleanLast};${cleanFirst};;;`,
    `FN:${fullName}`,
    `EMAIL;TYPE=INTERNET,HOME:${cleanEmail}`,
  ];

  if (twitterUrl) {
    lines.push(`URL;TYPE=Twitter:${twitterUrl}`);
    lines.push(`X-SOCIALPROFILE;type=twitter:${twitterUrl}`);
  }

  if (githubUrl) {
    lines.push(`URL;TYPE=GitHub:${githubUrl}`);
  }

  if (archetypeName) {
    lines.push(`TITLE:BADGEVERSE ${archetypeName}`);
    lines.push(`NOTE:Connected via BADGEVERSE 2026 · Archetype: ${archetypeName}`);
  } else {
    lines.push('NOTE:Connected via BADGEVERSE 2026');
  }

  lines.push('END:VCARD');

  return lines.join('\r\n');
}

/**
 * Returns a 2D boolean matrix of QR modules
 */
export function getQrMatrix(text: string): boolean[][] {
  const qr = getSafeQrInstance(text);
  const count = qr.getModuleCount();
  const matrix: boolean[][] = [];

  for (let r = 0; r < count; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < count; c++) {
      row.push(qr.isDark(r, c));
    }
    matrix.push(row);
  }

  return matrix;
}

/**
 * Generates an SVG string representation of the QR code
 */
export function generateQrSvgTag(
  text: string,
  cellSize: number = 6,
  margin: number = 4
): string {
  try {
    const qr = getSafeQrInstance(text);
    return qr.createSvgTag(cellSize, margin);
  } catch (err) {
    console.error('Failed to generate SVG QR tag', err);
    return '';
  }
}

/**
 * Generates high-res PNG DataURL using HTML5 canvas (with qrcode GIF dataURL as fallback)
 */
export function generateQrDataUrl(
  text: string,
  cellSize: number = 8,
  margin: number = 4
): string {
  try {
    const qr = getSafeQrInstance(text);
    const count = qr.getModuleCount();
    const size = (count + margin * 2) * cellSize;

    // Browser environment: render to clean PNG via canvas
    if (typeof document !== 'undefined') {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, size, size);

        ctx.fillStyle = '#000000';
        for (let r = 0; r < count; r++) {
          for (let c = 0; c < count; c++) {
            if (qr.isDark(r, c)) {
              ctx.fillRect(
                (c + margin) * cellSize,
                (r + margin) * cellSize,
                cellSize,
                cellSize
              );
            }
          }
        }
        return canvas.toDataURL('image/png');
      }
    }

    // Fallback: standard qrcode dataURL
    return qr.createDataURL(cellSize, margin);
  } catch (err) {
    console.error('Failed to generate QR data URL', err);
    return '';
  }
}
