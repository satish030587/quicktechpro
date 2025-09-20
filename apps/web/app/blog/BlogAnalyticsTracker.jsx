"use client";

import { useBlogViewTracker } from '../hooks/useBlogViewTracker';

export default function BlogAnalyticsTracker({ slug, source }) {
  useBlogViewTracker({ slug, source });
  return null;
}
