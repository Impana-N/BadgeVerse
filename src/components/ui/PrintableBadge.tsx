/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { forwardRef } from 'react';
import { Archetype, AttendeeInfo, BadgeTheme, CustomizationSettings } from '../../types';
import { QrCodeView } from './QrCodeView';

interface PrintableBadgeProps {
  attendee: AttendeeInfo;
  archetype: Archetype;
  theme: BadgeTheme;
  customization: CustomizationSettings;
  qrDataUrl: string;
  vCardString?: string;
  attendeeNumber: string;
}

export const PrintableBadge = forwardRef<HTMLDivElement, PrintableBadgeProps>(
  ({ attendee, archetype, theme, customization, qrDataUrl, vCardString, attendeeNumber }, ref) => {
    const fullName = `${attendee.firstName || ''} ${attendee.lastName || ''}`.trim() || 'Cosmic Traveler';

    // Theme-specific styling
    const getThemeStyles = () => {
      switch (theme.id) {
        case 'creative':
          return {
            gradient: 'from-[#3A2227] via-[#2A1620] to-[#160D1A]',
            accent: '#FFCDBD',
            secondary: '#FFE9A8',
            border: 'rgba(255, 205, 189, 0.45)',
            hologram: 'linear-gradient(135deg, rgba(255,205,189,0.7), rgba(255,233,168,0.7), rgba(201,184,245,0.6))',
          };
        case 'explorer':
          return {
            gradient: 'from-[#142C30] via-[#0E1F26] to-[#0A131A]',
            accent: '#C6E8D5',
            secondary: '#A5D6E7',
            border: 'rgba(198, 232, 213, 0.45)',
            hologram: 'linear-gradient(135deg, rgba(198,232,213,0.7), rgba(165,214,231,0.7), rgba(255,233,168,0.6))',
          };
        case 'dreamy':
        default:
          return {
            gradient: 'from-[#2C1B40] via-[#1E1430] to-[#120B1E]',
            accent: '#C9B8F5',
            secondary: '#FFCDBD',
            border: 'rgba(201, 184, 245, 0.45)',
            hologram: 'linear-gradient(135deg, rgba(201,184,245,0.75), rgba(255,205,189,0.7), rgba(255,233,168,0.65))',
          };
      }
    };

    const styles = getThemeStyles();
    const qrPayload = vCardString || qrDataUrl || 'BADGEVERSE 2026';

    return (
      <div
        ref={ref}
        id="printable-event-badge"
        className="printable-badge-root relative w-[360px] h-[560px] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between text-[#F7F3FF] p-6 select-none"
        style={{
          background: `linear-gradient(165deg, ${styles.gradient.split(' ')[0].replace('from-[', '').replace(']', '')} 0%, #150E22 60%, #0D0714 100%)`,
          borderColor: styles.border,
          borderWidth: '1.5px',
        }}
      >
        {/* Subtle background cosmic radial glow */}
        <div
          className="absolute -top-24 -left-24 w-72 h-72 rounded-full pointer-events-none blur-3xl opacity-35"
          style={{ backgroundColor: customization.accentColor }}
        />
        <div
          className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full pointer-events-none blur-3xl opacity-25"
          style={{ backgroundColor: styles.secondary }}
        />

        {/* Lanyard punch-hole slot guide */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 flex items-center justify-center">
          <div className="w-12 h-2.5 rounded-full bg-[#120B1E] border border-white/20 shadow-inner" />
        </div>

        {/* TOP SECTION: Branding & Badge Type */}
        <div className="pt-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono tracking-widest text-[#C9B8F5]/90 uppercase">
                Convergence · 2026
              </div>
              <div className="text-xl font-extrabold tracking-tight font-display text-white">
                BADGEVERSE
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[#FFE9A8]">
                ALL-ACCESS PASS
              </span>
              <div className="text-[10px] font-mono text-white/50 mt-1">
                {attendeeNumber}
              </div>
            </div>
          </div>

          {/* Holographic foil security stripe */}
          <div
            className="w-full h-1.5 rounded-full my-3.5 opacity-80"
            style={{ background: styles.hologram }}
          />
        </div>

        {/* MIDDLE SECTION: Archetype, Full Name & Socials */}
        <div className="my-auto flex flex-col items-center text-center">
          {/* Archetype pill */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 border shadow-sm"
            style={{
              backgroundColor: `${customization.accentColor}25`,
              borderColor: `${customization.accentColor}80`,
              color: customization.accentColor,
            }}
          >
            <span>✦</span>
            <span>{archetype.name}</span>
          </div>

          {/* Attendee Name */}
          <h2 className="text-3xl font-extrabold tracking-tight text-white font-display leading-tight max-w-[310px] break-words">
            {fullName}
          </h2>

          {/* Email */}
          <p className="text-xs text-[#C9B8F5] mt-1.5 font-medium max-w-[280px] truncate">
            {attendee.email || 'traveler@badgeverse.id'}
          </p>

          {/* Handles */}
          {(attendee.twitter || attendee.github) && (
            <div className="flex items-center justify-center gap-3 mt-2 text-[11px] font-mono text-white/80">
              {attendee.twitter && (
                <span className="flex items-center gap-1">
                  <span className="text-[#FFE9A8]">𝕏</span> {attendee.twitter}
                </span>
              )}
              {attendee.twitter && attendee.github && <span className="text-white/30">·</span>}
              {attendee.github && (
                <span className="flex items-center gap-1">
                  <span className="text-[#C6E8D5]">GH</span> {attendee.github}
                </span>
              )}
            </div>
          )}

          {/* Archetype Motto Quote */}
          <p className="text-[11px] italic text-[#F7F3FF]/70 mt-3 px-3 leading-relaxed max-w-[290px]">
            &ldquo;{archetype.quote}&rdquo;
          </p>
        </div>

        {/* BOTTOM SECTION: Real QR Code + Scan Instruction */}
        <div className="bg-[#120B1E]/80 border border-white/15 rounded-2xl p-3 flex items-center justify-between gap-4 mt-2">
          {/* QR Code Container with guaranteed SVG vector rendering */}
          <div className="shrink-0 flex items-center justify-center">
            <QrCodeView text={qrPayload} size={88} margin={2} />
          </div>

          {/* QR Explanatory & Pass verification metadata */}
          <div className="text-left flex-1 min-w-0">
            <div className="text-[11px] font-bold tracking-wide uppercase text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: customization.accentColor }} />
              Instant Connect
            </div>
            <p className="text-[10px] text-white/70 leading-normal mt-0.5">
              Scan with phone camera to add contact vCard & view digital profile.
            </p>
            <div className="text-[9px] font-mono text-[#FFE9A8]/90 mt-2 tracking-wider">
              BADGEVERSE SECURE ID · VERIFIED
            </div>
          </div>
        </div>

        {/* Bottom subtle edge notch */}
        <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-white/40">
          <span>THEME: {theme.name.toUpperCase()}</span>
          <span>EMBLEM: {customization.avatarId.toUpperCase()}</span>
        </div>
      </div>
    );
  }
);

PrintableBadge.displayName = 'PrintableBadge';
