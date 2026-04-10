'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface LockScreenProps {
  name: string;
  title: string;
  onUnlock: () => void;
}

const PASSWORD_DOTS = 8;
const TYPE_DELAY = 120;
const HOLD_AFTER_TYPED = 600;
const UNLOCK_ANIM_MS = 700;

export function LockScreen({ name, title, onUnlock }: LockScreenProps) {
  const [dotsTyped, setDotsTyped] = useState(0);
  const [unlocking, setUnlocking] = useState(false);
  const [startTyping, setStartTyping] = useState(false);

  /* 1. Wait 1.2 s before the dots start typing */
  useEffect(() => {
    const id = setTimeout(() => setStartTyping(true), 1200);
    return () => clearTimeout(id);
  }, []);

  /* 2. Type dots one-by-one, then hold, then start unlock animation */
  useEffect(() => {
    if (!startTyping) return;
    if (dotsTyped >= PASSWORD_DOTS) {
      const id = setTimeout(() => setUnlocking(true), HOLD_AFTER_TYPED);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setDotsTyped((d) => d + 1), TYPE_DELAY);
    return () => clearTimeout(id);
  }, [startTyping, dotsTyped]);

  /* 3. Once unlock animation starts, dismiss after its duration */
  useEffect(() => {
    if (!unlocking) return;
    const id = setTimeout(onUnlock, UNLOCK_ANIM_MS);
    return () => clearTimeout(id);
  }, [unlocking, onUnlock]);

  return (
    <div
      className={`lockscreen ${unlocking ? 'lockscreen-unlocking' : ''}`}
      onClick={onUnlock}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
          e.preventDefault();
          onUnlock();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Lock screen. Press Enter or click to skip."
    >
      <div className="lockscreen-content">
        <div className="lockscreen-avatar">
          <Image
            src="/avatar.png"
            alt={name}
            width={160}
            height={160}
            priority
          />
        </div>

        <h1 className="lockscreen-name">{name}</h1>
        <p className="lockscreen-title">{title}</p>

        <div className="lockscreen-password" aria-hidden="true">
          <div className="lockscreen-dots">
            {Array.from({ length: PASSWORD_DOTS }).map((_, i) => (
              <span
                key={i}
                className={`lockscreen-dot ${i < dotsTyped ? 'filled' : ''}`}
              />
            ))}
          </div>
          {dotsTyped >= PASSWORD_DOTS && (
            <span className="lockscreen-password-hint">Authenticating...</span>
          )}
        </div>
      </div>

      <p className="lockscreen-hint">
        Click anywhere or press any key to unlock
      </p>
    </div>
  );
}
