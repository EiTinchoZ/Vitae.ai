'use client';

import { QRCodeSVG } from 'qrcode.react';

interface QrCardProps {
  url: string;
  label?: string;
  size?: number;
}

/**
 * QrCard — glassmorphism QR code card for networking / hero section.
 * Renders a scannable QR pointing to the provided URL.
 */
export function QrCard({ url, label = 'Escanear CV', size = 96 }: QrCardProps) {
  return (
    <div
      className="rounded-[1.4rem] p-5 w-[280px] pointer-events-auto"
      style={{
        backgroundColor: 'rgba(242,240,233,0.08)',
        border: '1px solid rgba(242,240,233,0.20)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 22px 40px rgba(0,0,0,0.24)',
      }}
    >
      <p
        className="text-[10px] uppercase tracking-[0.2em] mb-3"
        style={{
          color: 'rgba(242,240,233,0.55)',
          fontFamily: 'var(--font-geist-mono), monospace',
        }}
      >
        {label}
      </p>

      <div className="flex items-center gap-4">
        {/* QR code */}
        <div
          className="rounded-xl overflow-hidden p-1.5 flex-shrink-0"
          style={{ background: 'rgba(242,240,233,0.96)' }}
        >
          <QRCodeSVG
            value={url}
            size={size}
            bgColor="rgba(242,240,233,0.96)"
            fgColor="#1a1a1a"
            level="M"
          />
        </div>

        {/* Side text */}
        <div className="flex flex-col gap-1">
          <span
            className="text-xs font-semibold leading-tight"
            style={{ color: 'rgba(242,240,233,0.90)' }}
          >
            Martin Bundy
          </span>
          <span
            className="text-[10px] leading-snug"
            style={{ color: 'rgba(242,240,233,0.52)', fontFamily: 'var(--font-geist-mono), monospace' }}
          >
            @EiTinchoZ
          </span>
          <div className="mt-1 h-px w-full" style={{ backgroundColor: 'rgba(242,240,233,0.12)' }} />
          <span
            className="text-[9px] mt-1 leading-snug"
            style={{ color: 'rgba(242,240,233,0.40)', fontFamily: 'var(--font-geist-mono), monospace' }}
          >
            portfolio-eitinchos-projects
            <br />.vercel.app
          </span>
        </div>
      </div>
    </div>
  );
}
