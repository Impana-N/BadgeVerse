/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { toPng } from 'html-to-image';
import {
  Download,
  Printer,
  Edit3,
  RotateCcw,
  Sparkles,
  Repeat,
  Copy,
  Check,
  CheckCircle2,
  QrCode,
  Box,
  Eye,
} from 'lucide-react';
import {
  Archetype,
  AttendeeInfo,
  BadgeTheme,
  CustomizationSettings,
} from '../../types';
import { SceneCanvas } from '../3d/SceneCanvas';
import { Badge3DCard } from '../3d/Badge3DCard';
import { DreamySkyScene } from '../3d/DreamySkyScene';
import { PrintableBadge } from './PrintableBadge';
import { QrCodeView } from './QrCodeView';
import { soundFx } from '../../utils/audio';

interface RevealBadgeViewProps {
  attendee: AttendeeInfo;
  archetype: Archetype;
  theme: BadgeTheme;
  customization: CustomizationSettings;
  qrDataUrl: string;
  vCardString: string;
  attendeeNumber: string;
  onEditDetails: () => void;
  onRestart: () => void;
}

export function RevealBadgeView({
  attendee,
  archetype,
  theme,
  customization,
  qrDataUrl,
  vCardString,
  attendeeNumber,
  onEditDetails,
  onRestart,
}: RevealBadgeViewProps) {
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedVCard, setCopiedVCard] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const badgeCardRef = useRef<HTMLDivElement>(null);

  // Trigger celebratory confetti on mount
  useEffect(() => {
    soundFx.playBadgeGenerated();

    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#C9B8F5', '#FFCDBD', '#FFE9A8', '#C6E8D5', '#FFFFFF'],
        disableForReducedMotion: true,
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  // Download high-resolution badge PNG
  const handleDownloadPng = async () => {
    soundFx.playTap();
    if (!badgeCardRef.current) return;

    try {
      setIsDownloading(true);
      const dataUrl = await toPng(badgeCardRef.current, {
        quality: 0.98,
        pixelRatio: 2.5,
        cacheBust: true,
      });

      const cleanFirst = attendee.firstName.trim().toLowerCase() || 'badge';
      const cleanLast = attendee.lastName.trim().toLowerCase() || 'verse';
      const fileName = `badgeverse-${cleanFirst}-${cleanLast}.png`;

      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to export badge as PNG', err);
      // Fallback: download QR code data url directly if badge render failed
      if (qrDataUrl) {
        const link = document.createElement('a');
        link.download = `badgeverse-qr-${attendee.firstName || 'attendee'}.png`;
        link.href = qrDataUrl;
        link.click();
      }
    } finally {
      setIsDownloading(false);
    }
  };

  // Print badge directly using dedicated @media print CSS
  const handlePrint = () => {
    soundFx.playTap();
    window.print();
  };

  // Copy vCard text to clipboard
  const handleCopyVCard = () => {
    soundFx.playTap();
    if (vCardString) {
      navigator.clipboard.writeText(vCardString);
      setCopiedVCard(true);
      setTimeout(() => setCopiedVCard(false), 2500);
    }
  };

  const handleToggleFlip = () => {
    soundFx.playTap();
    setIsFlipped((prev) => !prev);
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-65px)] flex flex-col justify-between overflow-x-hidden">
      {/* Hidden print container: ONLY visible during window.print() */}
      <div className="hidden print:flex print-only-container">
        <PrintableBadge
          attendee={attendee}
          archetype={archetype}
          theme={theme}
          customization={customization}
          qrDataUrl={qrDataUrl}
          vCardString={vCardString}
          attendeeNumber={attendeeNumber}
        />
      </div>

      {/* Main Visible Interactive View */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex-1 flex flex-col justify-between no-print">
        {/* Top Grand Reveal Header */}
        <div className="text-center space-y-2 pt-2">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-[#FFE9A8]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>IDENTITY REVEALED · ALL-ACCESS CONVERGENCE PASS</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-white text-wrap-balance"
          >
            Your identity is <span className="text-gradient-gold">ready.</span>
          </motion.h1>

          <p className="text-sm sm:text-base text-[#C9B8F5] max-w-lg mx-auto font-light">
            One scan away from a new connection.
          </p>

          {/* View Mode Switcher: 3D Holographic Pass vs Official 2D Pass */}
          <div className="pt-2 flex items-center justify-center gap-2">
            <div className="inline-flex p-1 bg-white/10 backdrop-blur-md rounded-xl border border-white/15">
              <button
                onClick={() => {
                  soundFx.playTap();
                  setViewMode('3d');
                }}
                type="button"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  viewMode === '3d'
                    ? 'bg-[#FFE9A8] text-[#160E24] font-bold shadow-sm'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>3D Floating Pass</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playTap();
                  setViewMode('2d');
                }}
                type="button"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  viewMode === '2d'
                    ? 'bg-[#FFE9A8] text-[#160E24] font-bold shadow-sm'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Printable Pass & QR</span>
              </button>
            </div>
          </div>
        </div>

        {/* Central Display: 3D Scene or 2D Pass View + QR Scan Station */}
        <div className="my-auto py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Visual Showcase (3D or 2D) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            {viewMode === '3d' ? (
              <div className="relative w-full max-w-[460px] h-[520px] rounded-3xl bg-[#1A102A]/80 border border-[#C9B8F5]/30 shadow-2xl flex items-center justify-center overflow-hidden">
                <SceneCanvas cameraPosition={[0, 0, 6.2]} fov={42}>
                  <DreamySkyScene interactive={false} />
                  <Badge3DCard
                    attendee={attendee}
                    archetype={archetype}
                    theme={theme}
                    customization={customization}
                    isFlipped={isFlipped}
                    onToggleFlip={handleToggleFlip}
                    qrDataUrl={qrDataUrl}
                    vCardString={vCardString}
                  />
                </SceneCanvas>

                {/* Flip Badge button on 3D Card */}
                <button
                  onClick={handleToggleFlip}
                  type="button"
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#140C20]/85 hover:bg-[#201332] border border-white/25 text-xs font-mono text-white shadow-lg backdrop-blur-md transition-all active:scale-95 cursor-pointer"
                >
                  <Repeat className="w-3.5 h-3.5 text-[#FFE9A8]" />
                  <span>{isFlipped ? 'Show Badge Front' : 'Flip Badge (View Back)'}</span>
                </button>

                <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-mono text-[#C9B8F5] border border-white/10 pointer-events-none">
                  DRAG OR HOVER TO TILT
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                {/* 2D Visible Printable Badge with captured ref */}
                <div className="p-2 rounded-3xl shadow-2xl">
                  <PrintableBadge
                    ref={badgeCardRef}
                    attendee={attendee}
                    archetype={archetype}
                    theme={theme}
                    customization={customization}
                    qrDataUrl={qrDataUrl}
                    vCardString={vCardString}
                    attendeeNumber={attendeeNumber}
                  />
                </div>
              </div>
            )}

            {/* Hidden capture target when in 3D mode */}
            {viewMode === '3d' && (
              <div className="absolute -top-[9999px] -left-[9999px] pointer-events-none opacity-0">
                <PrintableBadge
                  ref={badgeCardRef}
                  attendee={attendee}
                  archetype={archetype}
                  theme={theme}
                  customization={customization}
                  qrDataUrl={qrDataUrl}
                  vCardString={vCardString}
                  attendeeNumber={attendeeNumber}
                />
              </div>
            )}

            <p className="text-xs font-mono text-white/50 mt-3 text-center">
              Pass ID: {attendeeNumber} · Theme: {theme.name}
            </p>
          </div>

          {/* Right Column: Pass Specification & Live QR Scan Station */}
          <div className="lg:col-span-5 space-y-5">
            {/* Live QR Scan Station */}
            <div className="glass-panel rounded-3xl p-5 border border-[#FFE9A8]/30 bg-gradient-to-br from-[#2D1B40]/70 via-[#1F142E]/80 to-[#120B1C]/90 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#FFE9A8]/20 flex items-center justify-center text-[#FFE9A8]">
                    <QrCode className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Live Smartphone QR Scanner
                    </h4>
                    <p className="text-[10px] text-white/60">
                      vCard 3.0 Contact Format
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
                  Ready to Scan
                </span>
              </div>

              {/* QR Code and Quick instruction */}
              <div className="flex items-center gap-4 p-3 bg-[#120B1E]/80 rounded-2xl border border-white/10">
                <div className="shrink-0 flex items-center justify-center">
                  <QrCodeView text={vCardString || qrDataUrl} size={96} margin={2} />
                </div>

                <div className="text-left space-y-1 min-w-0">
                  <p className="text-xs font-bold text-white">
                    {attendee.firstName} {attendee.lastName}
                  </p>
                  <p className="text-[11px] text-[#C9B8F5] truncate">
                    {attendee.email || 'traveler@badgeverse.id'}
                  </p>
                  {attendee.twitter && (
                    <p className="text-[10px] font-mono text-[#FFE9A8] truncate">
                      {attendee.twitter}
                    </p>
                  )}
                  <p className="text-[10px] text-white/50 pt-1 leading-tight">
                    Point your iPhone or Android camera at this code to save contact details directly.
                  </p>
                </div>
              </div>
            </div>

            {/* Profile specifications & Actions Panel */}
            <div className="glass-panel rounded-3xl p-6 border border-[#C9B8F5]/30 space-y-4">
              {/* Primary Functional Action Buttons */}
              <div className="space-y-2.5">
                {/* Download PNG Button */}
                <button
                  onClick={handleDownloadPng}
                  disabled={isDownloading}
                  type="button"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#C9B8F5] via-[#FFCDBD] to-[#FFE9A8] text-[#160E24] font-bold text-sm shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {downloadSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                      <span>BADGE SAVED TO DOWNLOADS!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>{isDownloading ? 'RASTERIZING BADGE...' : 'DOWNLOAD BADGE (PNG)'}</span>
                    </>
                  )}
                </button>

                {/* Print Badge Button */}
                <button
                  onClick={handlePrint}
                  type="button"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-[#FFE9A8]" />
                  <span>PRINT EVENT PASS (LANYARD FORMAT)</span>
                </button>
              </div>

              {/* Secondary actions: Edit details, copy vcard */}
              <div className="flex items-center gap-2 pt-1 border-t border-white/10">
                <button
                  onClick={onEditDetails}
                  type="button"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-mono text-[#F7F3FF] transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#C9B8F5]" />
                  <span>Edit Info</span>
                </button>

                <button
                  onClick={handleCopyVCard}
                  type="button"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-mono text-[#F7F3FF] transition-colors cursor-pointer"
                  title="Copy formatted vCard text"
                >
                  {copiedVCard ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#FFE9A8]" />
                      <span>Copy vCard</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onRestart}
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-mono text-[#F7F3FF] transition-colors cursor-pointer"
                  title="Start fresh with a new journey"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-red-300" />
                  <span className="sr-only sm:not-sr-only">Restart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
