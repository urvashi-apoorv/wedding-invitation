import type { Metadata, Viewport } from "next";
import "./globals.css";
import { weddingConfig } from "./wedding.config";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? weddingConfig.site.url;
const siteUrl = configuredSiteUrl.endsWith("/") ? configuredSiteUrl : `${configuredSiteUrl}/`;
const socialPreviewImageUrl = new URL(weddingConfig.site.socialPreviewImage, siteUrl).toString();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${weddingConfig.pages.page2.brideName} & ${weddingConfig.pages.page2.groomName} — Wedding Invitation`,
  description: `You are invited to celebrate the wedding of ${weddingConfig.pages.page2.brideName} and ${weddingConfig.pages.page2.groomName} in ${weddingConfig.pages.page3.city}.`,
  alternates: { canonical: siteUrl },
  icons: { icon: "./branding/wax-seal-cutout.png" },
  openGraph: {
    title: `${weddingConfig.pages.page2.brideName} & ${weddingConfig.pages.page2.groomName} — Wedding Invitation`,
    description: `${weddingConfig.pages.page3.displayDate} · ${weddingConfig.pages.page3.city}`,
    type: "website",
    url: siteUrl,
    siteName: `${weddingConfig.pages.page2.brideName} & ${weddingConfig.pages.page2.groomName}`,
    locale: "en_IN",
    images: [{
      url: socialPreviewImageUrl,
      secureUrl: socialPreviewImageUrl,
      type: "image/png",
      width: 1200,
      height: 630,
      alt: weddingConfig.site.socialPreviewAlt,
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${weddingConfig.pages.page2.brideName} & ${weddingConfig.pages.page2.groomName}`,
    description: `${weddingConfig.pages.page3.displayDate} · ${weddingConfig.pages.page3.city}`,
    images: [socialPreviewImageUrl],
  },
};

export const viewport: Viewport = {
  themeColor: "#3a0714",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
