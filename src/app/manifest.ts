import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dating App - Find Your Perfect Match",
    short_name: "DatingApp",
    description:
      "Connect with amazing people in your area. Swipe, match, and start meaningful conversations.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ec4899",
    orientation: "portrait-primary",
    scope: "/",
    lang: "en",
    categories: ["social", "lifestyle", "dating"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/favicon.ico",
        sizes: "32x32",
        type: "image/x-icon",
      },
    ],
    shortcuts: [
      {
        name: "Discover Matches",
        short_name: "Discover",
        description: "Find new people to match with",
        url: "/discover",
        icons: [{ src: "/icon.svg", sizes: "any" }],
      },
      {
        name: "Messages",
        short_name: "Chat",
        description: "View your conversations",
        url: "/messages",
        icons: [{ src: "/icon.svg", sizes: "any" }],
      },
      {
        name: "Profile",
        short_name: "Profile",
        description: "Edit your profile",
        url: "/profile",
        icons: [{ src: "/icon.svg", sizes: "any" }],
      },
    ],
  };
}
