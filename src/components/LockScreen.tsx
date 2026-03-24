'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface LockScreenProps {
  name: string;
  title: string;
  onUnlock: () => void;
}

const PASSWORD_DOTS = 8;
const TYPE_DELAY = 120;
const HOLD_AFTER_TYPED = 600;

export function LockScreen({ name, title, onUnlock }: LockScreenProps) {
  const [dotsTyped, setDotsTyped] = useState(0);
  const [unlocking, setUnlocking] = useState(false);
  const [startTyping, setStartTyping] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStartTyping(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!startTyping) return;
    if (dotsTyped >= PASSWORD_DOTS) {
      const hold = setTimeout(() => setUnlocking(true), HOLD_AFTER_TYPED);
      return () => clearTimeout(hold);
    }
    const timer = setTimeout(() => setDotsTyped((d) => d + 1), TYPE_DELAY);
    return () => clearTimeout(timer);
  }, [startTyping, dotsTyped]);

  const handleAnimationEnd = useCallback(() => {
    if (unlocking) onUnlock();
  }, [unlocking, onUnlock]);

  return (
    <div
      className={`lockscreen ${unlocking ? 'lockscreen-unlocking' : ''}`}
      onAnimationEnd={handleAnimationEnd}
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

        <div className="lockscreen-password">
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
