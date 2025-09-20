export const metadata = { title: "Booking" };

import BookingForm from "../components/BookingForm";

export default function BookingPage() {
  return (
    <section className="section">
      <h1>Book a Service</h1>
      <p className="muted">Choose the service type and tell us about your issue. Payments integrate later (Razorpay).</p>

      <BookingForm />
    </section>
  );
}
