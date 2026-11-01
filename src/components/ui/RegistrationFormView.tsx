/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Sparkles, User, Mail, AtSign, Github, AlertCircle } from 'lucide-react';
import { AttendeeInfo, FormErrors } from '../../types';
import { soundFx } from '../../utils/audio';

interface RegistrationFormViewProps {
  attendee: AttendeeInfo;
  onChangeAttendee: (attendee: AttendeeInfo) => void;
  onGenerateBadge: () => void;
  onBackToCustomization: () => void;
  onCancelForm: () => void;
}

export function RegistrationFormView({
  attendee,
  onChangeAttendee,
  onGenerateBadge,
  onBackToCustomization,
  onCancelForm,
}: RegistrationFormViewProps) {
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Real-time validation helper
  const validate = (info: AttendeeInfo): FormErrors => {
    const errs: FormErrors = {};

    if (!info.firstName || !info.firstName.trim()) {
      errs.firstName = 'First name cannot be empty.';
    }

    if (!info.lastName || !info.lastName.trim()) {
      errs.lastName = 'Last name cannot be empty.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!info.email || !info.email.trim()) {
      errs.email = 'Email address is required for your vCard QR code.';
    } else if (!emailRegex.test(info.email.trim())) {
      errs.email = 'Please enter a valid email format (e.g. name@domain.com).';
    }

    // GitHub username validation (if supplied)
    if (info.github && info.github.trim()) {
      const cleanGh = info.github.trim().replace(/^@/, '');
      const ghRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
      if (!ghRegex.test(cleanGh)) {
        errs.github = 'GitHub username must contain only alphanumeric characters or hyphens.';
      }
    }

    return errs;
  };

  const handleBlur = (field: keyof AttendeeInfo) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Normalize Twitter username on blur
    let updated = { ...attendee };
    if (field === 'twitter' && attendee.twitter.trim()) {
      let tw = attendee.twitter.trim();
      if (!tw.startsWith('@')) {
        tw = `@${tw}`;
      }
      updated.twitter = tw;
      onChangeAttendee(updated);
    }

    // Normalize GitHub on blur (remove leading @ if present)
    if (field === 'github' && attendee.github.trim()) {
      const gh = attendee.github.trim().replace(/^@/, '');
      updated.github = gh;
      onChangeAttendee(updated);
    }

    const errs = validate(updated);
    setErrors(errs);
  };

  const handleChange = (field: keyof AttendeeInfo, value: string) => {
    const updated = { ...attendee, [field]: value };
    onChangeAttendee(updated);

    if (touched[field]) {
      const errs = validate(updated);
      setErrors(errs);
    }
  };

  const currentErrors = validate(attendee);
  const isFormValid =
    attendee.firstName.trim().length > 0 &&
    attendee.lastName.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(attendee.email.trim()) &&
    Object.keys(currentErrors).length === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Auto-normalize handles
    let cleanTwitter = attendee.twitter.trim();
    if (cleanTwitter && !cleanTwitter.startsWith('@')) {
      cleanTwitter = `@${cleanTwitter}`;
    }
    const cleanGithub = attendee.github.trim().replace(/^@/, '');

    const finalAttendee: AttendeeInfo = {
      ...attendee,
      firstName: attendee.firstName.trim(),
      lastName: attendee.lastName.trim(),
      email: attendee.email.trim(),
      twitter: cleanTwitter,
      github: cleanGithub,
    };

    const errs = validate(finalAttendee);
    setErrors(errs);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      twitter: true,
      github: true,
    });

    if (Object.keys(errs).length === 0) {
      onChangeAttendee(finalAttendee);
      soundFx.playTap();
      onGenerateBadge();
    }
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-65px)] flex flex-col justify-between p-6 max-w-3xl mx-auto">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between pt-2">
        <button
          onClick={onBackToCustomization}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono text-[#F7F3FF] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Customization</span>
        </button>

        <span className="text-xs font-mono text-[#C9B8F5]/80">
          STEP 03 OF 04 · REGISTRATION
        </span>
      </div>

      {/* Main Form Container */}
      <div className="my-auto py-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-10 shadow-2xl border border-[#C9B8F5]/30">
          <div className="text-center max-w-lg mx-auto mb-8 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-[#FFE9A8]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DIGITAL CONTACT EMBEDDING</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
              Let&apos;s put a name to your universe.
            </h2>
            <p className="text-xs sm:text-sm text-[#F7F3FF]/70 font-light">
              Your details will be encoded into a real, smartphone-scannable vCard QR code on your event badge.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Name Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="first-name-input"
                  className="block text-xs font-mono uppercase tracking-wider text-[#C9B8F5]"
                >
                  First Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="first-name-input"
                    type="text"
                    required
                    value={attendee.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    onBlur={() => handleBlur('firstName')}
                    placeholder="e.g. Maya"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1D112B]/80 text-white placeholder:text-white/30 text-sm border focus:outline-none transition-colors ${
                      touched.firstName && errors.firstName
                        ? 'border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400'
                        : 'border-white/15 focus:border-[#C9B8F5] focus:ring-1 focus:ring-[#C9B8F5]'
                    }`}
                  />
                </div>
                {touched.firstName && errors.firstName && (
                  <p className="text-[11px] text-red-300 flex items-center gap-1 mt-1 font-sans">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.firstName}</span>
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="last-name-input"
                  className="block text-xs font-mono uppercase tracking-wider text-[#C9B8F5]"
                >
                  Last Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="last-name-input"
                    type="text"
                    required
                    value={attendee.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    onBlur={() => handleBlur('lastName')}
                    placeholder="e.g. Lin"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1D112B]/80 text-white placeholder:text-white/30 text-sm border focus:outline-none transition-colors ${
                      touched.lastName && errors.lastName
                        ? 'border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400'
                        : 'border-white/15 focus:border-[#C9B8F5] focus:ring-1 focus:ring-[#C9B8F5]'
                    }`}
                  />
                </div>
                {touched.lastName && errors.lastName && (
                  <p className="text-[11px] text-red-300 flex items-center gap-1 mt-1 font-sans">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.lastName}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label
                htmlFor="email-input"
                className="block text-xs font-mono uppercase tracking-wider text-[#C9B8F5]"
              >
                Email Address <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="email-input"
                  type="email"
                  required
                  value={attendee.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  placeholder="e.g. maya@badgeverse.id"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1D112B]/80 text-white placeholder:text-white/30 text-sm border focus:outline-none transition-colors ${
                    touched.email && errors.email
                      ? 'border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400'
                      : 'border-white/15 focus:border-[#C9B8F5] focus:ring-1 focus:ring-[#C9B8F5]'
                  }`}
                />
              </div>
              {touched.email && errors.email ? (
                <p className="text-[11px] text-red-300 flex items-center gap-1 mt-1 font-sans">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.email}</span>
                </p>
              ) : (
                <p className="text-[11px] text-white/40 font-mono">
                  Used by QR scanners to automatically populate the vCard contact card.
                </p>
              )}
            </div>

            {/* Social Handles (Optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
              {/* Twitter */}
              <div className="space-y-1.5">
                <label
                  htmlFor="twitter-input"
                  className="block text-xs font-mono uppercase tracking-wider text-white/70"
                >
                  Twitter / X Handle <span className="text-white/40 text-[10px]">(Optional)</span>
                </label>
                <div className="relative">
                  <AtSign className="w-4 h-4 text-[#FFE9A8]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="twitter-input"
                    type="text"
                    value={attendee.twitter}
                    onChange={(e) => handleChange('twitter', e.target.value)}
                    onBlur={() => handleBlur('twitter')}
                    placeholder="@username"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1D112B]/80 text-white placeholder:text-white/30 text-sm border border-white/15 focus:border-[#C9B8F5] focus:ring-1 focus:ring-[#C9B8F5] focus:outline-none transition-colors"
                  />
                </div>
                <p className="text-[10px] text-white/40 font-mono">
                  Automatically formatted with @ prefix.
                </p>
              </div>

              {/* GitHub */}
              <div className="space-y-1.5">
                <label
                  htmlFor="github-input"
                  className="block text-xs font-mono uppercase tracking-wider text-white/70"
                >
                  GitHub Username <span className="text-white/40 text-[10px]">(Optional)</span>
                </label>
                <div className="relative">
                  <Github className="w-4 h-4 text-[#C6E8D5]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="github-input"
                    type="text"
                    value={attendee.github}
                    onChange={(e) => handleChange('github', e.target.value)}
                    onBlur={() => handleBlur('github')}
                    placeholder="octocat"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1D112B]/80 text-white placeholder:text-white/30 text-sm border focus:outline-none transition-colors ${
                      touched.github && errors.github
                        ? 'border-red-400 focus:border-red-400'
                        : 'border-white/15 focus:border-[#C9B8F5] focus:ring-1 focus:ring-[#C9B8F5]'
                    }`}
                  />
                </div>
                {touched.github && errors.github ? (
                  <p className="text-[11px] text-red-300 flex items-center gap-1 mt-1 font-sans">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.github}</span>
                  </p>
                ) : (
                  <p className="text-[10px] text-white/40 font-mono">
                    Validated against standard GitHub handle formats.
                  </p>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
              {/* Cancel / Clear button */}
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Clear all fields in this form?')) {
                    onCancelForm();
                  }
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-red-300/20 bg-red-500/10 hover:bg-red-500/20 text-red-200 text-xs font-mono transition-colors"
              >
                Clear Fields
              </button>

              {/* Submit / Generate button */}
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                  isFormValid
                    ? 'bg-gradient-to-r from-[#C9B8F5] via-[#FFCDBD] to-[#FFE9A8] text-[#160E24] shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                    : 'bg-white/10 text-white/30 cursor-not-allowed border border-white/5'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>GENERATE UNIVERSE BADGE</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full text-center text-xs font-mono text-white/40 pb-2">
        Data remains 100% private in your browser · No external data tracking
      </div>
    </div>
  );
}
