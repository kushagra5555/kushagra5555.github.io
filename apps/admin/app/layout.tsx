import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0d0d0d", color: "#f4d27a", fontFamily: "Inter, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
