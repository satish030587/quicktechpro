"use client";

import { useEffect } from 'react';
import { apiFetch, API_URL } from '../lib/api';

const STORAGE_KEY = 'qtp_blog_fingerprint';
const SOURCE_FALLBACK = 'direct';

function ensureFingerprint() {
  if (typeof window === 'undefined') return null;
  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing) return existing;
    const generated = `fp_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
    window.localStorage.setItem(STORAGE_KEY, generated);
    return generated;
  } catch {
    return null;
  }
}

function normaliseSource(source) {
  if (typeof window === 'undefined') return SOURCE_FALLBACK;
  if (source && typeof source === 'string') return source;

  const referrer = document.referrer;
  if (!referrer) return SOURCE_FALLBACK;

  try {
    const refHost = new URL(referrer).hostname.toLowerCase();
    const ownHost = window.location.hostname.toLowerCase();
    if (ownHost && refHost.includes(ownHost)) return 'internal';
    if (/google|bing|duckduckgo|yahoo|baidu|yandex/.test(refHost)) return 'search';
    if (/facebook|instagram|twitter|linkedin|tiktok|reddit|whatsapp|telegram/.test(refHost)) return 'social';
    return 'referral';
  } catch {
    return 'referral';
  }
}

export function useBlogViewTracker({ slug, source }) {
  useEffect(() => {
    if (!slug || typeof window === 'undefined') return undefined;

    const fingerprint = ensureFingerprint();
    const resolvedSource = normaliseSource(source);
    const startTime = performance.now();
    let reported = false;
    const endpointPath = `/blog/posts/${slug}/view`;
    const endpointUrl = `${API_URL}${endpointPath}`;

    const send = (durationSeconds) => {
      if (reported) return;
      reported = true;
      const payload = {
        durationSeconds: Math.max(0, Math.round(durationSeconds)),
        source: resolvedSource,
        fingerprint
      };
      try {
        const body = JSON.stringify(payload);
        if (navigator.sendBeacon) {
          const blob = new Blob([body], { type: 'application/json' });
          if (navigator.sendBeacon(endpointUrl, blob)) {
            return;
          }
        }
      } catch {}
      void apiFetch(endpointPath, {
        method: 'POST',
        auth: false,
        body: payload,
        headers: { 'Content-Type': 'application/json' }
      }).catch(() => {});
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        const duration = (performance.now() - startTime) / 1000;
        send(duration);
      }
    };

    const handlePageHide = () => {
      const duration = (performance.now() - startTime) / 1000;
      send(duration);
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('beforeunload', handlePageHide);

    const fallbackTimer = window.setTimeout(() => {
      const duration = (performance.now() - startTime) / 1000;
      send(duration);
    }, 45000);

    return () => {
      window.clearTimeout(fallbackTimer);
      if (!reported) {
        const duration = (performance.now() - startTime) / 1000;
        send(duration);
      }
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('beforeunload', handlePageHide);
    };
  }, [slug, source]);
}
