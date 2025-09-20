import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Script from "next/script";
import { AuthProvider } from "./providers";

export const metadata = {
  title: {
    default: "QuickTechPro | Computer Repair & Web Development in Bangalore",
    template: "%s | QuickTechPro"
  },
  description:
    "Professional computer repair, remote support, onsite IT services, and web development in Bangalore. Transparent pricing and same-day support.",
  metadataBase: new URL("https://www.quicktechpro.com"),
  icons: { icon: "/favicon.svg" }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen w-full bg-white text-slate-900">
        <a href="#main" className="skip">Skip to content</a>
        <AuthProvider>
          <Header />
          <main id="main" className="w-full">{children}</main>
          <Footer />
        </AuthProvider>
        <Script id="ld-localbusiness" type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "QuickTechPro",
            url: "https://www.quicktechpro.com/",
            telephone: "+91-XXXXXXXXXX",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Bangalore",
              addressRegion: "KA",
              addressCountry: "IN"
            },
            areaServed: { "@type": "City", name: "Bangalore" },
            openingHours: "Mo-Sa 09:00-19:00",
            sameAs: [
              "https://www.facebook.com/quicktechpro",
              "https://www.instagram.com/quicktechpro"
            ],
            makesOffer: [
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Remote Computer Support" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Onsite IT Support" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Web Development" } }
            ]
          }) }}
        />
      </body>
    </html>
  );
}
