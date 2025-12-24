import type { Metadata } from "next";
import { getProcessedData } from "@/lib/data";
import "./globals.css";

export function generateMetadata(): Metadata {
  const data = getProcessedData();
  const ogParams = new URLSearchParams({
    name: data.userName,
    conversations: data.overview.totalConversations.toString(),
    days: data.overview.activeDays.toString(),
    tools: data.overview.uniqueTools.toString(),
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const ogUrl = `${baseUrl}/api/og?${ogParams.toString()}`;

  return {
    title: `${data.userName}'s Year in Review with Claude`,
    description: `${data.overview.totalConversations.toLocaleString()} conversations, ${data.overview.activeDays} active days of collaboration with Claude`,
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: `${data.userName}'s Year in Review with Claude`,
      description: `${data.overview.totalConversations.toLocaleString()} conversations, ${data.overview.activeDays} active days of collaboration with Claude`,
      type: "website",
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: `${data.userName}'s Year in Review with Claude`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.userName}'s Year in Review with Claude`,
      description: `${data.overview.totalConversations.toLocaleString()} conversations, ${data.overview.activeDays} active days of collaboration with Claude`,
      images: [ogUrl],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
