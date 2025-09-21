export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body style={{ fontFamily: 'system-ui, Segoe UI, Roboto, Arial' }}>{children}</body>
    </html>
  );
}
