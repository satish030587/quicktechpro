import { Suspense } from 'react';
import BookingThankYouContent from './BookingThankYouContent';

export const metadata = { title: "Booking Confirmed | QuickTechPro" };

export default function BookingThankYouPage() {
  return (
    <Suspense fallback={<div className="layout-container py-12 text-slate-600">Loading...</div>}>
      <BookingThankYouContent />
    </Suspense>
  );
}

