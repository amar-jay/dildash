// Type imports
import type { ManifestOptions } from "vite-plugin-pwa";

const DESCRIPTION = "Learn Turkish from A-Z using NLP";
/**
 * Defines the default SEO configuration for the website.
 */
export const seoConfig = {
  baseURL: "https://dildash.vercel.app", // Change this to your production URL.
  description: DESCRIPTION, // Change this to be your website's description.
  type: "website",
  image: {
    url: "https://dildash.vercel.app/images/thumbnail-1200x800.jpg", // Change this to your website's thumbnail.
    alt: "OpenGraph thumbnail description.", // Change this to your website's thumbnail description.
    width: 1200,
    height: 800,
  },
  siteName: "Dildash", // Change this to your website's name,
  twitter: {
    card: "summary_large_image",
  },
};

/**
 * Defines the configuration for PWA webmanifest.
 */
export const manifest: Partial<ManifestOptions> = {
  name: "Dildash", // Change this to your website's name.
  short_name: "Dildash", // Change this to your website's short name.
  description: DESCRIPTION, // Change this to your website's description.
  theme_color: "#222222", // Change this to your primary color.
  background_color: "#ffffff", // Change this to your background color.
  display: "minimal-ui",
  icons: [
    {
      src: "/images/dildash-192.ico",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "/images/dildash-500x500.png",
      sizes: "500x500",
      type: "image/png",
    },
    {
      src: "/images/dildash-256.ico",
      sizes: "256x256",
      type: "image/png",
      //  purpose: "any maskable",
    },
  ],
};
